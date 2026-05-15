import { Text } from '@react-three/drei';
import { useVRStore } from '../store/vrStore';
import { GlassPanel } from '../components/GlassPanel';
import { VRButton } from '../components/VRButton';

interface Props {
    isFocused: boolean;
    onFocus: () => void;
}

export function QuantumWeaverVR({ isFocused, onFocus }: Props) {
    const memories = useVRStore((s) => s.futureMemories);

    return (
        <GlassPanel
            size={[1.4, 1.2]}
            baseColor="#b794f6"
            hoverColor="#d8b4fe"
            onClick={onFocus}
            isActive={isFocused}
        >
            <Text
                position={[0, 0.45, 0]}
                fontSize={0.05}
                color="#b794f6"
                anchorX="center"
                anchorY="top"
                letterSpacing={0.1}
            >
                QUANTUM WEAVER
            </Text>

            <Text
                position={[0, 0.25, 0]}
                fontSize={0.035}
                color="rgba(255,255,255,0.7)"
                anchorX="center"
                anchorY="top"
            >
                Future Memories: {memories.length}
            </Text>

            {memories[0] && (
                <>
                    <Text
                        position={[0, 0.05, 0]}
                        fontSize={0.035}
                        color="rgba(255,255,255,0.9)"
                        anchorX="center"
                        anchorY="top"
                    >
                        Active: {memories[0].title}
                    </Text>
                    <Text
                        position={[0, -0.05, 0]}
                        fontSize={0.025}
                        color="#4fd1c5"
                        anchorX="center"
                        anchorY="top"
                    >
                        [{memories[0].emotions.join(' • ')}]
                    </Text>
                </>
            )}

            {isFocused && (
                <VRButton
                    position={[0, -0.35, 0]}
                    size={[1.0, 0.12]}
                    label="Rehearse Future"
                    color="#b794f6"
                    onClick={() => { /* Future: start rehearsal */ }}
                />
            )}
        </GlassPanel>
    );
}
