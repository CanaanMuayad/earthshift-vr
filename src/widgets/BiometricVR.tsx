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

function RingGauge({ 
    value, max, label, unit, color, position 
}: { 
    value: number; max: number; label: string; unit: string; color: string; 
    position: [number, number, number]; 
}) {
    const ringRef = useRef<THREE.Mesh>(null);
    const fraction = Math.min(value / max, 1);
    const endAngle = fraction * Math.PI * 2;

    useFrame(({ clock }) => {
        if (ringRef.current) {
            const t = clock.getElapsedTime();
            ringRef.current.scale.setScalar(1.0 + Math.sin(t * 2) * 0.02);
        }
    });

    return (
        <group position={position}>
            <mesh>
                <ringGeometry args={[0.12, 0.15, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} />
            </mesh>
            <mesh ref={ringRef} rotation={[0, 0, Math.PI / 2]}>
                <ringGeometry args={[0.12, 0.15, 32, 1, 0, endAngle]} />
                <meshBasicMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} />
            </mesh>
            <Text position={[0, 0, 0.01]} fontSize={0.06} color="#ffffff" anchorX="center" anchorY="middle">
                {Math.round(value)}
            </Text>
            <Text position={[0, -0.07, 0.01]} fontSize={0.025} color="rgba(255,255,255,0.5)" anchorX="center">
                {unit}
            </Text>
            <Text position={[0, -0.22, 0]} fontSize={0.03} color={color} anchorX="center" letterSpacing={0.08}>
                {label}
            </Text>
        </group>
    );
}

export function BiometricVR({ isFocused, onFocus }: Props) {
    const bio = useVRStore((s) => s.biometrics);

    return (
        <GlassPanel size={[1.4, 1.2]} baseColor="#ff6b6b" hoverColor="#ff8a8a" onClick={onFocus} isActive={isFocused}>
            <Text position={[0, 0.48, 0]} fontSize={0.045} color="#ff6b6b" anchorX="center" anchorY="top" letterSpacing={0.12}>
                BIOMETRIC INSIGHTS
            </Text>
            <RingGauge position={[-0.4, 0.05, 0]} value={bio.heartRate} max={120} label="HEART RATE" unit="bpm" color="#ff6b6b" />
            <RingGauge position={[0, 0.05, 0]} value={bio.hrv} max={100} label="HRV" unit="ms" color="#4fd1c5" />
            <RingGauge position={[0.4, 0.05, 0]} value={10 - bio.stress} max={10} label="CALM" unit={`${10 - bio.stress}/10`} color="#22d07a" />

            {isFocused && (
                <VRButton position={[0, -0.48, 0]} size={[0.9, 0.1]} label="Connect Wearable" color="#ff6b6b" onClick={() => {}} />
            )}
        </GlassPanel>
    );
}
