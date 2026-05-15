import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LiquidGlassProps {
    position?: [number, number, number];
    scale?: number;
}

export function LiquidGlass({ position = [0, 0, 0], scale = 1 }: LiquidGlassProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
            meshRef.current.rotation.x += delta * 0.1;
        }
    });

    return (
        <mesh position={position} scale={scale} ref={meshRef}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
                color="#4fd1c5"
                opacity={0.6}
                metalness={0.8}
                roughness={0.2}
                transparent={true}
            />
        </mesh>
    );
}
