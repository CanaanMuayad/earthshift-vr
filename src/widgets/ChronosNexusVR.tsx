
import { Text } from '@react-three/drei';
import { useVRStore } from '../store/vrStore';
import { GlassPanel } from '../components/GlassPanel';
import { VRButton } from '../components/VRButton';

interface Props {
    isFocused: boolean;
    onFocus: () => void;
}

export function ChronosNexusVR({ isFocused, onFocus }: Props) {
    const briefings = useVRStore((s) => s.briefings);
    const latestBriefing = briefings[0]; // Assuming sorted

    return (
        <GlassPanel
            size={[1.4, 1.2]}
            baseColor="#eab308" // sov-warning for time
            hoverColor="#fef08a"
            onClick={onFocus}
            isActive={isFocused}
        >
            <Text
                position={[0, 0.45, 0]}
                fontSize={0.05}
                color="#eab308"
                anchorX="center"
                anchorY="top"
                letterSpacing={0.1}
            >
                CHRONOS NEXUS
            </Text>

            {latestBriefing ? (
                <>
                    <Text
                        position={[0, 0.3, 0]}
                        fontSize={0.035}
                        color="rgba(255,255,255,0.9)"
                        anchorX="center"
                        anchorY="top"
                    >
                        {latestBriefing.type.toUpperCase()} BRIEFING
                    </Text>

                    <Text
                        position={[0, 0.15, 0]}
                        fontSize={0.032}
                        color="rgba(255,255,255,0.7)"
                        anchorX="center"
                        anchorY="top"
                        maxWidth={1.1}
                        lineHeight={1.4}
                        textAlign="center"
                    >
                        {latestBriefing.content}
                    </Text>
                </>
            ) : (
                <Text
                    position={[0, 0.15, 0]}
                    fontSize={0.035}
                    color="rgba(255,255,255,0.5)"
                    anchorX="center"
                >
                    No pending briefings.
                </Text>
            )}

            {isFocused && (
                <VRButton
                    position={[0, -0.4, 0]}
                    size={[0.9, 0.12]}
                    label="Read Full Briefing"
                    color="#eab308"
                    onClick={() => { /* Future: expand briefing */ }}
                />
            )}
        </GlassPanel>
    );
}
