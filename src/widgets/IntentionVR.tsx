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

export function IntentionVR({ isFocused, onFocus }: Props) {
    const intentions = useVRStore((s) => s.intentions);
    const flameRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (flameRef.current) {
            const t = clock.getElapsedTime();
            flameRef.current.scale.y = 1.0 + Math.sin(t * 3) * 0.15 + Math.sin(t * 7) * 0.05;
            flameRef.current.scale.x = 1.0 + Math.sin(t * 4) * 0.08;
            flameRef.current.position.x = Math.sin(t * 2) * 0.005;
        }
    });

    const active = intentions.filter(i => i.isActive);

    return (
        <GlassPanel
            size={[1.3, 1.5]}
            baseColor="#22d07a"
            hoverColor="#4fd1c5"
            onClick={onFocus}
            isActive={isFocused}
        >
            <Text
                position={[0, 0.6, 0]}
                fontSize={0.05}
                color="#22d07a"
                anchorX="center"
                anchorY="top"
                letterSpacing={0.12}
            >
                SACRED INTENTIONS
            </Text>

            {/* Candle */}
            <mesh position={[0, 0.15, 0]}>
                <cylinderGeometry args={[0.03, 0.035, 0.2, 8]} />
                <meshStandardMaterial color="#f5e6d3" />
            </mesh>
            <mesh ref={flameRef} position={[0, 0.28, 0]}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshBasicMaterial color="#ffcc00" transparent opacity={0.9} />
            </mesh>
            <mesh position={[0, 0.28, 0]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshBasicMaterial color="#ff8800" transparent opacity={0.15} />
            </mesh>
            <pointLight position={[0, 0.3, 0.1]} intensity={0.3} color="#ffcc00" distance={1} />

            {/* Intentions list */}
            {active.map((intention, i) => (
                <Text
                    key={intention.id}
                    position={[0, -0.1 - i * 0.18, 0]}
                    fontSize={0.035}
                    color="rgba(255,255,255,0.85)"
                    anchorX="center"
                    anchorY="top"
                    maxWidth={1.1}
                    lineHeight={1.3}
                >
                    {intention.text}
                </Text>
            ))}

            {/* Action button when focused */}
            {isFocused && (
                <VRButton
                    position={[0, -0.62, 0]}
                    size={[0.9, 0.1]}
                    label="✦ Begin Intention Ritual"
                    color="#22d07a"
                    onClick={() => { /* Future: intention ritual */ }}
                />
            )}
        </GlassPanel>
    );
}
