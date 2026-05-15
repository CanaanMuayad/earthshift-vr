import React, { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface GlassPanelProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
    size?: [number, number];
    children?: React.ReactNode;
    baseColor?: string;
    hoverColor?: string;
    onClick?: () => void;
    isActive?: boolean;
    draggable?: boolean;
    onDrag?: (newPos: [number, number, number]) => void;
}

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform vec3 baseColor;
uniform vec3 hoverColor;
uniform float hoverState;
uniform float opacity;
uniform float activeState;
uniform float dragState;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
    
    float mixFactor = max(hoverState, activeState * 0.6);
    vec3 glowColor = mix(baseColor, hoverColor, mixFactor);
    vec3 finalColor = mix(baseColor * 0.08, glowColor, fresnel * 0.8 + 0.15);
    
    // Border highlight — thicker when draggable
    float borderW = 0.03 + dragState * 0.01;
    float border = step(1.0 - borderW, vUv.x) + step(vUv.x, borderW) + step(1.0 - borderW, vUv.y) + step(vUv.y, borderW);
    border = clamp(border, 0.0, 1.0);
    finalColor += glowColor * border * (0.4 + mixFactor * 0.6 + dragState * 0.4);
    
    float scanline = sin(vUv.y * 80.0) * 0.02;
    finalColor += vec3(scanline);
    
    gl_FragColor = vec4(finalColor, opacity + fresnel * 0.4 + mixFactor * 0.15);
}
`;

export function GlassPanel({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    size = [1.5, 1.0],
    children,
    baseColor = '#22d07a',
    hoverColor = '#4fd1c5',
    onClick,
    isActive = false,
    draggable = true,
    onDrag,
}: GlassPanelProps) {
    const groupRef = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const [hovered, setHovered] = useState(false);
    const [dragging, setDragging] = useState(false);
    const dragStart = useRef<THREE.Vector3 | null>(null);
    const posStart = useRef<THREE.Vector3 | null>(null);

    // Smooth hover + active + drag transitions
    useFrame((_, delta) => {
        if (materialRef.current) {
            const targetHover = hovered ? 1.0 : 0.0;
            const targetActive = isActive ? 1.0 : 0.0;
            const targetDrag = dragging ? 1.0 : (draggable ? 0.3 : 0.0);
            const u = materialRef.current.uniforms;
            u.hoverState.value = THREE.MathUtils.lerp(u.hoverState.value, targetHover, delta * 5);
            u.activeState.value = THREE.MathUtils.lerp(u.activeState.value, targetActive, delta * 3);
            u.dragState.value = THREE.MathUtils.lerp(u.dragState.value, targetDrag, delta * 5);
        }
    });

    const uniforms = useRef({
        baseColor: { value: new THREE.Color(baseColor) },
        hoverColor: { value: new THREE.Color(hoverColor) },
        hoverState: { value: 0.0 },
        activeState: { value: 0.0 },
        opacity: { value: 0.25 },
        dragState: { value: 0.0 },
    }).current;

    // Detect if pointer is near the border (within 15% of edges)
    const isBorderHit = useCallback((uv: THREE.Vector2): boolean => {
        const margin = 0.12;
        return uv.x < margin || uv.x > 1 - margin || uv.y < margin || uv.y > 1 - margin;
    }, []);

    const handlePointerDown = useCallback((e: any) => {
        if (!draggable) return;
        const uv = e.uv as THREE.Vector2 | undefined;
        if (uv && isBorderHit(uv)) {
            e.stopPropagation();
            setDragging(true);
            // Store the 3D hit point and current group position
            dragStart.current = e.point.clone();
            if (groupRef.current) {
                posStart.current = groupRef.current.position.clone();
            }
            // Capture pointer for smooth drag
            (e.target as any)?.setPointerCapture?.(e.pointerId);
        }
    }, [draggable, isBorderHit]);

    const handlePointerMove = useCallback((e: any) => {
        if (!dragging || !dragStart.current || !posStart.current || !groupRef.current) return;
        e.stopPropagation();

        // Calculate delta from drag start point to current point
        const delta = e.point.clone().sub(dragStart.current);
        const newPos: [number, number, number] = [
            posStart.current.x + delta.x,
            posStart.current.y + delta.y,
            posStart.current.z + delta.z,
        ];
        groupRef.current.position.set(...newPos);
        onDrag?.(newPos);
    }, [dragging, onDrag]);

    const handlePointerUp = useCallback((e: any) => {
        if (dragging) {
            e.stopPropagation();
            setDragging(false);
            dragStart.current = null;
            posStart.current = null;
            (e.target as any)?.releasePointerCapture?.(e.pointerId);
        }
    }, [dragging]);

    const handleClick = useCallback((e: any) => {
        // Only trigger click if we weren't dragging
        if (!dragging) {
            e.stopPropagation();
            onClick?.();
        }
    }, [dragging, onClick]);

    const handlePointerOver = useCallback((e: any) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'grab';
    }, []);

    const handlePointerOut = useCallback((e: any) => {
        e.stopPropagation();
        setHovered(false);
        if (!dragging) document.body.style.cursor = 'default';
    }, [dragging]);

    return (
        <group ref={groupRef} position={position} rotation={rotation}>
            <mesh
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                <planeGeometry args={[size[0], size[1], 1, 1]} />
                <shaderMaterial
                    ref={materialRef}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                    transparent
                    side={THREE.DoubleSide}
                    depthWrite={false}
                />
            </mesh>

            {/* Widget content */}
            <group position={[0, 0, 0.05]}>
                {children}
            </group>
        </group>
    );
}
