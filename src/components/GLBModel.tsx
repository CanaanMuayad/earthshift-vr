import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

interface GLBModelProps {
    url: string;
    position?: [number, number, number];
    scale?: number;
    rotation?: [number, number, number];
    rotateSpeed?: number;
    onClick?: () => void;
    hoverScale?: number;
}

export function GLBModel({ url, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], rotateSpeed = 0, onClick, hoverScale = 1.1 }: GLBModelProps) {
    const { scene } = useGLTF(url);
    const ref = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((_, delta) => {
        if (ref.current && rotateSpeed !== 0) {
            ref.current.rotation.y += delta * rotateSpeed;
        }
        if (ref.current) {
            const targetScale = hovered ? scale * hoverScale : scale;
            ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
        }
    });

    return (
        <group 
            ref={ref} 
            position={position} 
            rotation={rotation} 
            scale={scale}
            onClick={(e) => {
                if (onClick) {
                    e.stopPropagation();
                    onClick();
                }
            }}
            onPointerOver={(e) => {
                if (onClick) {
                    e.stopPropagation();
                    setHovered(true);
                    document.body.style.cursor = 'pointer';
                }
            }}
            onPointerOut={(e) => {
                if (onClick) {
                    e.stopPropagation();
                    setHovered(false);
                    document.body.style.cursor = 'default';
                }
            }}
        >
            <primitive object={scene} />
        </group>
    );
}

// Preload common models
// useGLTF.preload('/candle.glb');
// useGLTF.preload('/crystal.glb');
// useGLTF.preload('/astrolabe.glb');
