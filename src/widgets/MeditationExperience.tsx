import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { VRButton } from '../components/VRButton';
import { GlassPanel } from '../components/GlassPanel';

// ═══════════════════════════════════════════
// Breathing patterns from the main app
// ═══════════════════════════════════════════

interface BreathingPattern {
    id: string;
    name: string;
    inhale: number;
    hold: number;
    exhale: number;
    holdOut: number;
}

const PATTERNS: BreathingPattern[] = [
    { id: 'box', name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, holdOut: 4 },
    { id: 'relax', name: 'Relaxing Breath', inhale: 4, hold: 7, exhale: 8, holdOut: 0 },
    { id: 'mindful', name: 'Mindful Breathing', inhale: 5, hold: 0, exhale: 7, holdOut: 0 },
];

type Phase = 'inhale' | 'hold' | 'exhale' | 'holdOut';

const PHASE_COLORS: Record<Phase, string> = {
    inhale: '#4fd1c5',
    hold: '#b794f6',
    exhale: '#22d07a',
    holdOut: '#ffa726',
};

const PHASE_LABELS: Record<Phase, string> = {
    inhale: 'BREATHE IN',
    hold: 'HOLD',
    exhale: 'BREATHE OUT',
    holdOut: 'HOLD',
};

// ═══════════════════════════════════════════
// Breathing Sphere — the core visual
// ═══════════════════════════════════════════

function BreathingSphere({ phase, progress }: { phase: Phase; progress: number }) {
    const sphereRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const ringsRef = useRef<THREE.Group>(null);
    const particlesRef = useRef<THREE.Points>(null);

    // Create particle field
    const particleGeometry = useMemo(() => {
        const count = 200;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 0.8 + Math.random() * 1.2;
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geo;
    }, []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        const color = new THREE.Color(PHASE_COLORS[phase]);

        // Breathing scale
        let targetScale: number;
        if (phase === 'inhale') {
            targetScale = 0.4 + progress * 0.6; // 0.4 → 1.0
        } else if (phase === 'exhale') {
            targetScale = 1.0 - progress * 0.6; // 1.0 → 0.4
        } else {
            targetScale = phase === 'hold' ? 1.0 : 0.4;
        }

        if (sphereRef.current) {
            const s = THREE.MathUtils.lerp(sphereRef.current.scale.x, targetScale, 0.08);
            sphereRef.current.scale.setScalar(s);
            sphereRef.current.rotation.y = t * 0.15;
            sphereRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
            (sphereRef.current.material as THREE.MeshStandardMaterial).color = color;
            (sphereRef.current.material as THREE.MeshStandardMaterial).emissive = color;
        }

        if (glowRef.current) {
            const gs = THREE.MathUtils.lerp(glowRef.current.scale.x, targetScale * 1.5, 0.06);
            glowRef.current.scale.setScalar(gs);
            (glowRef.current.material as THREE.MeshBasicMaterial).color = color;
            (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.06 + Math.sin(t * 2) * 0.02;
        }

        if (ringsRef.current) {
            ringsRef.current.rotation.z = t * 0.3;
            ringsRef.current.rotation.x = t * 0.15;
            const rs = THREE.MathUtils.lerp(ringsRef.current.scale.x, targetScale * 1.2, 0.06);
            ringsRef.current.scale.setScalar(rs);
        }

        if (particlesRef.current) {
            particlesRef.current.rotation.y = t * 0.05;
            const ps = THREE.MathUtils.lerp(particlesRef.current.scale.x, targetScale, 0.04);
            particlesRef.current.scale.setScalar(ps);
            (particlesRef.current.material as THREE.PointsMaterial).color = color;
        }
    });

    return (
        <group>
            {/* Core sphere — wireframe icosahedron */}
            <mesh ref={sphereRef}>
                <icosahedronGeometry args={[0.4, 3]} />
                <meshStandardMaterial
                    color="#4fd1c5"
                    emissive="#4fd1c5"
                    emissiveIntensity={0.4}
                    wireframe
                    transparent
                    opacity={0.7}
                />
            </mesh>

            {/* Outer glow sphere */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.5, 24, 24]} />
                <meshBasicMaterial color="#4fd1c5" transparent opacity={0.06} side={THREE.BackSide} />
            </mesh>

            {/* Orbital rings */}
            <group ref={ringsRef}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.55, 0.005, 8, 64]} />
                    <meshBasicMaterial color="#4fd1c5" transparent opacity={0.3} />
                </mesh>
                <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
                    <torusGeometry args={[0.5, 0.003, 8, 64]} />
                    <meshBasicMaterial color="#b794f6" transparent opacity={0.2} />
                </mesh>
            </group>

            {/* Particle field */}
            <points ref={particlesRef} geometry={particleGeometry}>
                <pointsMaterial color="#4fd1c5" size={0.015} transparent opacity={0.4} sizeAttenuation />
            </points>

            {/* Central light */}
            <pointLight intensity={0.6} color="#4fd1c5" distance={5} />
        </group>
    );
}

// ═══════════════════════════════════════════
// Timer ring
// ═══════════════════════════════════════════

function TimerRing({ elapsed, duration }: { elapsed: number; duration: number }) {
    const fraction = Math.min(elapsed / duration, 1);
    const endAngle = fraction * Math.PI * 2;

    return (
        <group position={[0, -0.9, -1.8]} rotation={[0, 0, Math.PI / 2]}>
            {/* Background */}
            <mesh>
                <ringGeometry args={[0.25, 0.27, 64]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
            </mesh>
            {/* Progress */}
            <mesh>
                <ringGeometry args={[0.25, 0.27, 64, 1, 0, endAngle]} />
                <meshBasicMaterial color="#4fd1c5" transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>
            {/* Time text */}
            <Text position={[0, 0, 0.01]} fontSize={0.06} color="#ffffff" anchorX="center" anchorY="middle">
                {formatTime(elapsed)}
            </Text>
            <Text position={[0, -0.08, 0.01]} fontSize={0.025} color="rgba(255,255,255,0.4)" anchorX="center">
                / {formatTime(duration)}
            </Text>
        </group>
    );
}

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// ═══════════════════════════════════════════
// Full Meditation Experience
// ═══════════════════════════════════════════

interface MeditationExperienceProps {
    onClose: () => void;
}

export function MeditationExperience({ onClose }: MeditationExperienceProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedPattern, setSelectedPattern] = useState(0);
    const [phase, setPhase] = useState<Phase>('inhale');
    const [phaseProgress, setPhaseProgress] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [sessionDuration] = useState(5 * 60); // 5 minutes default

    const pattern = PATTERNS[selectedPattern];
    const phaseTimerRef = useRef(0);

    // Breathing engine
    useFrame((_, delta) => {
        if (!isPlaying) return;

        setElapsed(prev => prev + delta);
        phaseTimerRef.current += delta;

        // Get current phase duration
        const phases: { phase: Phase; duration: number }[] = [
            { phase: 'inhale', duration: pattern.inhale },
            ...(pattern.hold > 0 ? [{ phase: 'hold' as Phase, duration: pattern.hold }] : []),
            { phase: 'exhale', duration: pattern.exhale },
            ...(pattern.holdOut > 0 ? [{ phase: 'holdOut' as Phase, duration: pattern.holdOut }] : []),
        ];

        const currentIdx = phases.findIndex(p => p.phase === phase);
        const currentPhase = phases[currentIdx];

        if (currentPhase) {
            const progress = Math.min(phaseTimerRef.current / currentPhase.duration, 1);
            setPhaseProgress(progress);

            if (phaseTimerRef.current >= currentPhase.duration) {
                phaseTimerRef.current = 0;
                const nextIdx = (currentIdx + 1) % phases.length;
                setPhase(phases[nextIdx].phase);
            }
        }

        // Auto-stop at session end
        if (elapsed >= sessionDuration) {
            setIsPlaying(false);
        }
    });

    return (
        <group>
            {/* Ambient lights */}
            <ambientLight intensity={0.15} />
            <pointLight position={[0, 3, 0]} intensity={0.3} color="#4fd1c5" distance={8} />
            <pointLight position={[-2, 1, -2]} intensity={0.2} color="#b794f6" distance={6} />

            {/* Breathing sphere */}
            <group position={[0, 1.5, -2.0]}>
                <BreathingSphere phase={phase} progress={phaseProgress} />
            </group>

            {/* Phase label */}
            <Text
                position={[0, 2.5, -2.0]}
                fontSize={0.08}
                color={PHASE_COLORS[phase]}
                anchorX="center"
                letterSpacing={0.2}
            >
                {isPlaying ? PHASE_LABELS[phase] : 'READY'}
            </Text>

            {/* Pattern name */}
            <Text
                position={[0, 2.7, -2.0]}
                fontSize={0.035}
                color="rgba(255,255,255,0.3)"
                anchorX="center"
                letterSpacing={0.1}
            >
                {pattern.name}
            </Text>

            {/* Timer ring */}
            {isPlaying && <TimerRing elapsed={elapsed} duration={sessionDuration} />}

            {/* Controls at bottom */}
            {!isPlaying ? (
                <group position={[0, 0.3, -2.0]}>
                    {/* Pattern selector */}
                    <GlassPanel
                        position={[0, 0, 0]}
                        size={[2.0, 0.8]}
                        baseColor="#1a1a2e"
                        hoverColor="#1a1a2e"
                    >
                        <Text
                            position={[0, 0.25, 0]}
                            fontSize={0.04}
                            color="rgba(255,255,255,0.5)"
                            anchorX="center"
                            letterSpacing={0.1}
                        >
                            SELECT BREATHING PATTERN
                        </Text>

                        {PATTERNS.map((p, i) => (
                            <VRButton
                                key={p.id}
                                position={[-0.55 + i * 0.55, 0.02, 0]}
                                size={[0.5, 0.1]}
                                label={p.name}
                                color={selectedPattern === i ? '#4fd1c5' : '#555'}
                                onClick={() => setSelectedPattern(i)}
                            />
                        ))}

                        <Text
                            position={[0, -0.15, 0]}
                            fontSize={0.03}
                            color="rgba(255,255,255,0.35)"
                            anchorX="center"
                        >
                            {pattern.inhale}s in{pattern.hold > 0 ? ` — ${pattern.hold}s hold` : ''} — {pattern.exhale}s out{pattern.holdOut > 0 ? ` — ${pattern.holdOut}s hold` : ''}
                        </Text>
                    </GlassPanel>

                    {/* Start button */}
                    <VRButton
                        position={[0, -0.55, 0]}
                        size={[0.8, 0.14]}
                        label="▶  BEGIN SESSION"
                        color="#22d07a"
                        onClick={() => {
                            setIsPlaying(true);
                            setElapsed(0);
                            setPhase('inhale');
                            phaseTimerRef.current = 0;
                        }}
                    />
                </group>
            ) : (
                <group position={[0, 0.3, -2.0]}>
                    {/* Pause / Stop buttons */}
                    <VRButton
                        position={[-0.3, 0, 0]}
                        size={[0.5, 0.12]}
                        label="⏸  PAUSE"
                        color="#ffa726"
                        onClick={() => setIsPlaying(false)}
                    />
                    <VRButton
                        position={[0.3, 0, 0]}
                        size={[0.5, 0.12]}
                        label="⏹  END"
                        color="#ff6b6b"
                        onClick={() => {
                            setIsPlaying(false);
                            setElapsed(0);
                        }}
                    />
                </group>
            )}

            {/* Back button */}
            <VRButton
                position={[-1.2, 2.5, -2.0]}
                size={[0.5, 0.1]}
                label="← BACK"
                color="#ff6b6b"
                onClick={onClose}
            />
        </group>
    );
}
