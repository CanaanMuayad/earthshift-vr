import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useVRStore } from '../store/vrStore';
import { GlassPanel } from '../components/GlassPanel';
import { VRButton } from '../components/VRButton';

interface Props {
    isFocused: boolean;
    onFocus: () => void;
}

export function EmotionalCoreVR({ isFocused, onFocus }: Props) {
    const emotional = useVRStore((s) => s.emotional);
    const sphereRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (sphereRef.current) {
            const t = clock.getElapsedTime();
            const breathRate = 0.5 + emotional.intensity * 0.1;
            sphereRef.current.scale.setScalar(1.0 + Math.sin(t * breathRate) * 0.08);
            sphereRef.current.rotation.y = t * 0.2;
        }
    });

    return (
        <GlassPanel size={[1.4, 1.2]} baseColor={emotional.color} hoverColor="#ffffff" onClick={onFocus} isActive={isFocused}>
            <Text position={[0, 0.48, 0]} fontSize={0.045} color={emotional.color} anchorX="center" anchorY="top" letterSpacing={0.12}>
                EMOTIONAL CORE
            </Text>

            {/* Emotion sphere */}
            <mesh ref={sphereRef} position={[0, 0.1, 0.1]}>
                <icosahedronGeometry args={[0.15, 2]} />
                <meshStandardMaterial color={emotional.color} emissive={emotional.color} emissiveIntensity={0.3} transparent opacity={0.7} wireframe />
            </mesh>
            <mesh position={[0, 0.1, 0.08]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color={emotional.color} transparent opacity={0.08} />
            </mesh>
            <pointLight position={[0, 0.1, 0.2]} intensity={0.4} color={emotional.color} distance={1.5} />

            <Text position={[0, -0.15, 0]} fontSize={0.07} color="#ffffff" anchorX="center" anchorY="middle">
                {emotional.primary}
            </Text>
            <Text position={[0, -0.28, 0]} fontSize={0.035} color="rgba(255,255,255,0.5)" anchorX="center">
                Intensity: {emotional.intensity}/10
            </Text>

            {/* Intensity bar */}
            <mesh position={[0, -0.38, 0]}>
                <planeGeometry args={[1.0, 0.03]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
            </mesh>
            <mesh position={[-(1.0 * (1 - emotional.intensity / 10)) / 2, -0.38, 0.01]}>
                <planeGeometry args={[1.0 * (emotional.intensity / 10), 0.03]} />
                <meshBasicMaterial color={emotional.color} transparent opacity={0.7} />
            </mesh>

            {isFocused && (
                <VRButton position={[0, -0.48, 0]} size={[0.9, 0.1]} label="Log Emotion Check-In" color={emotional.color} onClick={() => {}} />
            )}
        </GlassPanel>
    );
}
