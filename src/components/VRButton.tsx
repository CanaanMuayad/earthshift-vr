import { useState, useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface VRButtonProps {
    position?: [number, number, number];
    size?: [number, number];
    label: string;
    color?: string;
    onClick?: () => void;
}

/**
 * A clickable 3D button for VR interfaces.
 * Responds to raycasting from controllers and mouse.
 */
export function VRButton({
    position = [0, 0, 0],
    size = [0.6, 0.1],
    label,
    color = '#4fd1c5',
    onClick,
}: VRButtonProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const [pressed, setPressed] = useState(false);
    const scaleRef = useRef(1);

    useFrame((_, delta) => {
        const target = pressed ? 0.92 : hovered ? 1.05 : 1.0;
        scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, target, delta * 12);
        if (meshRef.current) {
            meshRef.current.scale.setScalar(scaleRef.current);
        }
    });

    const handleClick = useCallback((e: any) => {
        e.stopPropagation();
        setPressed(true);
        setTimeout(() => setPressed(false), 150);
        onClick?.();
    }, [onClick]);

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onClick={handleClick}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
                onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
                onPointerDown={(e) => { e.stopPropagation(); setPressed(true); }}
                onPointerUp={(e) => { e.stopPropagation(); setPressed(false); }}
            >
                <planeGeometry args={[size[0], size[1]]} />
                <meshBasicMaterial
                    color={hovered ? color : '#1a1a2e'}
                    transparent
                    opacity={hovered ? 0.4 : 0.25}
                />
            </mesh>

            {/* Border */}
            <lineSegments position={[0, 0, 0.001]}>
                <edgesGeometry args={[new THREE.PlaneGeometry(size[0], size[1])]} />
                <lineBasicMaterial color={color} transparent opacity={hovered ? 0.9 : 0.5} />
            </lineSegments>

            {/* Label */}
            <Text
                position={[0, 0, 0.005]}
                fontSize={size[1] * 0.4}
                color={hovered ? '#ffffff' : color}
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.05}
            >
                {label}
            </Text>
        </group>
    );
}
