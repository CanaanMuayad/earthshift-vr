// VR Progress Widget
import { Text } from '@react-three/drei';
import { useVRStore } from '../store/vrStore';
import { GlassPanel } from '../components/GlassPanel';
import { VRButton } from '../components/VRButton';

interface Props {
    isFocused: boolean;
    onFocus: () => void;
}

export function ProgressVR({ isFocused, onFocus }: Props) {
    const progress = useVRStore((s) => s.progress);
    const fraction = progress.dailyScore / 100;

    return (
        <GlassPanel size={[1.4, 1.2]} baseColor="#4fd1c5" hoverColor="#6ee7db" onClick={onFocus} isActive={isFocused}>
            <Text position={[0, 0.48, 0]} fontSize={0.045} color="#4fd1c5" anchorX="center" anchorY="top" letterSpacing={0.12}>
                PROGRESS TRACKING
            </Text>
            <Text position={[0, 0.18, 0]} fontSize={0.14} color="#ffffff" anchorX="center" anchorY="middle">
                {progress.dailyScore}%
            </Text>
            <Text position={[0, 0.05, 0]} fontSize={0.03} color="rgba(255,255,255,0.5)" anchorX="center">
                DAILY ALIGNMENT SCORE
            </Text>

            {/* Progress bar */}
            <mesh position={[0, -0.08, 0]}>
                <planeGeometry args={[1.1, 0.04]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
            </mesh>
            <mesh position={[-(1.1 * (1 - fraction)) / 2, -0.08, 0.01]}>
                <planeGeometry args={[1.1 * fraction, 0.04]} />
                <meshBasicMaterial color="#4fd1c5" transparent opacity={0.8} />
            </mesh>

            {/* Stats */}
            <group position={[-0.35, -0.25, 0]}>
                <Text fontSize={0.06} color="#ffffff" anchorX="center" anchorY="middle">{progress.weekStreak}</Text>
                <Text position={[0, -0.06, 0]} fontSize={0.025} color="rgba(255,255,255,0.4)" anchorX="center">DAY STREAK</Text>
            </group>
            <group position={[0.35, -0.25, 0]}>
                <Text fontSize={0.06} color="#ffffff" anchorX="center" anchorY="middle">{progress.completedToday}/{progress.totalToday}</Text>
                <Text position={[0, -0.06, 0]} fontSize={0.025} color="rgba(255,255,255,0.4)" anchorX="center">COMPLETED</Text>
            </group>

            {isFocused && (
                <VRButton position={[0, -0.48, 0]} size={[0.9, 0.1]} label="View Detailed Stats" color="#4fd1c5" onClick={() => {}} />
            )}
        </GlassPanel>
    );
}
