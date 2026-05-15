import { Text } from '@react-three/drei';
import { useVRStore } from '../store/vrStore';
import { GlassPanel } from '../components/GlassPanel';
import { VRButton } from '../components/VRButton';

interface Props {
    isFocused: boolean;
    onFocus: () => void;
}

export function InnerDialogueVR({ isFocused, onFocus }: Props) {
    const affirmations = useVRStore((s) => s.affirmations);

    return (
        <GlassPanel
            size={[1.4, 1.2]}
            baseColor="#4fd1c5"
            hoverColor="#81e6d9"
            onClick={onFocus}
            isActive={isFocused}
        >
            <Text
                position={[0, 0.45, 0]}
                fontSize={0.05}
                color="#4fd1c5"
                anchorX="center"
                anchorY="top"
                letterSpacing={0.1}
            >
                INNER DIALOGUE
            </Text>

            <Text
                position={[0, 0.25, 0]}
                fontSize={0.035}
                color="rgba(255,255,255,0.7)"
                anchorX="center"
                anchorY="top"
            >
                Active Affirmations: {affirmations.length}
            </Text>

            {affirmations[0] && (
                <Text
                    position={[0, 0.05, 0]}
                    fontSize={0.032}
                    color="rgba(255,255,255,0.9)"
                    anchorX="center"
                    anchorY="top"
                    maxWidth={1.1}
                    lineHeight={1.4}
                    textAlign="center"
                    fontStyle="italic"
                >
                    "{affirmations[0].statement}"
                </Text>
            )}

            {isFocused && (
                <>
                    <VRButton
                        position={[0, -0.25, 0]}
                        size={[1.0, 0.12]}
                        label="Affirmation Loop"
                        color="#4fd1c5"
                        onClick={() => { /* Future: start loop */ }}
                    />
                    <VRButton
                        position={[0, -0.42, 0]}
                        size={[1.0, 0.12]}
                        label="Dissolve Belief"
                        color="#b794f6" // Violet for dissolve
                        onClick={() => { /* Future: dissolve belief */ }}
                    />
                </>
            )}
        </GlassPanel>
    );
}
