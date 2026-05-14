import { Text } from '@react-three/drei';
import { useVRStore } from '../store/vrStore';
import { GlassPanel } from '../components/GlassPanel';
import { VRButton } from '../components/VRButton';

interface Props {
    isFocused: boolean;
    onFocus: () => void;
}

export function ExocortexVR({ isFocused, onFocus }: Props) {
    const messages = useVRStore((s) => s.exocortexMessages);
    const last3 = messages.slice(-3);

    return (
        <GlassPanel
            size={[2.6, 1.6]}
            baseColor="#22d07a"
            hoverColor="#4fd1c5"
            onClick={onFocus}
            isActive={isFocused}
        >
            {/* Header */}
            <Text
                position={[0, 0.62, 0]}
                fontSize={0.055}
                color="#22d07a"
                anchorX="center"
                anchorY="top"
                letterSpacing={0.12}
            >
                EXOCORTEX GUIDE — ALFRED
            </Text>

            {/* Separator line */}
            <mesh position={[0, 0.55, 0]}>
                <planeGeometry args={[2.2, 0.002]} />
                <meshBasicMaterial color="#22d07a" transparent opacity={0.3} />
            </mesh>

            {/* Messages */}
            {last3.map((msg, i) => (
                <group key={i} position={[0, 0.4 - i * 0.35, 0]}>
                    <Text
                        position={[-1.1, 0.06, 0]}
                        fontSize={0.03}
                        color={msg.role === 'assistant' ? '#4fd1c5' : '#b794f6'}
                        anchorX="left"
                        anchorY="top"
                        letterSpacing={0.1}
                    >
                        {msg.role === 'assistant' ? '◆ ALFRED' : '◇ YOU'}
                    </Text>
                    <Text
                        position={[-1.1, -0.03, 0]}
                        fontSize={0.038}
                        color="rgba(255,255,255,0.85)"
                        anchorX="left"
                        anchorY="top"
                        maxWidth={2.2}
                        lineHeight={1.4}
                    >
                        {msg.content}
                    </Text>
                </group>
            ))}

            {/* Interactive action */}
            {isFocused && (
                <VRButton
                    position={[0, -0.65, 0]}
                    size={[0.8, 0.1]}
                    label="Ask Alfred..."
                    color="#22d07a"
                    onClick={() => { /* Future: voice input */ }}
                />
            )}
        </GlassPanel>
    );
}
