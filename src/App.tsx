import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR } from '@react-three/xr';
import { Text } from '@react-three/drei';
import { xrStore, LocomotionWrapper } from './components/Locomotion';
import { ExocortexVR } from './widgets/ExocortexVR';
import { IntentionVR } from './widgets/IntentionVR';
import { BiometricVR } from './widgets/BiometricVR';
import { ProgressVR } from './widgets/ProgressVR';
import { EmotionalCoreVR } from './widgets/EmotionalCoreVR';
import { MeditationExperience } from './widgets/MeditationExperience';
import { ChronosNexusVR } from './widgets/ChronosNexusVR';
import { InnerDialogueVR } from './widgets/InnerDialogueVR';
import { QuantumWeaverVR } from './widgets/QuantumWeaverVR';
import { GlassPanel } from './components/GlassPanel';
import { VRButton } from './components/VRButton';
// import { LapItems } from './components/LapItems';
import { LiquidGlass } from './components/LiquidGlass';
import { useVRStore } from './store/vrStore';
import { Environment } from './components/Environment';
// Removed EffectComposer for WebXR stereoscopic compatibility
import './App.css';

// ═══════════════════════════════════════════
// VR Cockpit Scene — always alive, meditation overlays on top
// ═══════════════════════════════════════════

function VRCockpit() {
    const [focusedWidget, setFocusedWidget] = useState<string | null>(null);
    const [openWidgets, setOpenWidgets] = useState<Record<string, boolean>>({
        exocortex: false,
        intention: false,
        emotional: false,
        biometric: false,
        progress: false,
        meditation: false,
        innerDialogue: false,
        chronosNexus: false,
        quantumWeaver: false
    });
    const [activeExperience, setActiveExperience] = useState<string | null>(null);

    // @ts-ignore
    const toggleWidget = (id: string) => {
        setOpenWidgets((prev) => ({ ...prev, [id]: !prev[id] }));
    };
    const meditation = useVRStore((s) => s.meditation);

    const showMeditation = activeExperience === 'meditation';

    return (
        <>
            {/* Lighting for GLTF Models */}
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 10, 5]} intensity={2.5} />
            <pointLight position={[0, 2, -2]} intensity={2} color="#4fd1c5" distance={10} />

            {/* ════ WORLD & COCKPIT (hidden during meditation) ════ */}
            <LocomotionWrapper showMeditation={showMeditation}>
                {/* Ensure environment moves with the user's locomotion offset */}
                <Environment showMeditation={showMeditation} />
                {/* Lap Items (User GLBs) - Disabled for performance */}
                {/* <LapItems openWidgets={openWidgets} toggleWidget={toggleWidget} /> */}

                {/* Exocortex */}
                {openWidgets.exocortex && (
                    <group position={[0, 2.5, -2.5]}>
                        <ExocortexVR
                            isFocused={focusedWidget === 'exocortex'}
                            onFocus={() => setFocusedWidget(focusedWidget === 'exocortex' ? null : 'exocortex')}
                        />
                    </group>
                )}

                {/* Intention */}
                {openWidgets.intention && (
                    <group position={[-0.9, 1.0, -2.5]}>
                        <IntentionVR
                            isFocused={focusedWidget === 'intention'}
                            onFocus={() => setFocusedWidget(focusedWidget === 'intention' ? null : 'intention')}
                        />
                    </group>
                )}

                {/* Emotional Core */}
                {openWidgets.emotional && (
                    <group position={[0.9, 1.0, -2.5]}>
                        <EmotionalCoreVR
                            isFocused={focusedWidget === 'emotional'}
                            onFocus={() => setFocusedWidget(focusedWidget === 'emotional' ? null : 'emotional')}
                        />
                    </group>
                )}

                {/* Biometric */}
                {openWidgets.biometric && (
                    <group position={[2.8, 1.5, -1.8]} rotation={[0, -Math.PI / 5, 0]}>
                        <BiometricVR
                            isFocused={focusedWidget === 'biometric'}
                            onFocus={() => setFocusedWidget(focusedWidget === 'biometric' ? null : 'biometric')}
                        />
                    </group>
                )}

                {/* Progress */}
                {openWidgets.progress && (
                    <group position={[2.8, 0.0, -1.8]} rotation={[0, -Math.PI / 5, 0]}>
                        <ProgressVR
                            isFocused={focusedWidget === 'progress'}
                            onFocus={() => setFocusedWidget(focusedWidget === 'progress' ? null : 'progress')}
                        />
                    </group>
                )}

                {/* Meditation Panel (Left Wing) */}
                {openWidgets.meditation && (
                    <group position={[-2.8, 1.5, -1.8]} rotation={[0, Math.PI / 5, 0]}>
                        <GlassPanel
                            size={[1.4, 1.2]}
                            baseColor="#b794f6"
                            hoverColor="#d4a5ff"
                            onClick={() => setFocusedWidget(focusedWidget === 'meditation' ? null : 'meditation')}
                            isActive={focusedWidget === 'meditation'}
                        >
                            <Text position={[0, 0.48, 0]} fontSize={0.045} color="#b794f6" anchorX="center" anchorY="top" letterSpacing={0.12}>
                                AETHEL MEDITATION
                            </Text>
                            <Text position={[0, 0.2, 0]} fontSize={0.06} color="#ffffff" anchorX="center">
                                {meditation.totalMinutes} min
                            </Text>
                            <Text position={[0, 0.08, 0]} fontSize={0.03} color="rgba(255,255,255,0.4)" anchorX="center">
                                TOTAL PRACTICE — {meditation.streak} DAY STREAK
                            </Text>
                            <VRButton
                                position={[0, -0.15, 0]}
                                size={[0.8, 0.12]}
                                label="▶  Begin Session"
                                color="#b794f6"
                                onClick={() => setActiveExperience('meditation')}
                            />
                            <Text position={[0, -0.4, 0]} fontSize={0.025} color="rgba(255,255,255,0.3)" anchorX="center">
                                Last session: {new Date(meditation.lastSession).toLocaleDateString()}
                            </Text>
                        </GlassPanel>
                    </group>
                )}

                {/* Inner Dialogue (Left Wing Bottom) */}
                {openWidgets.innerDialogue && (
                    <group position={[-2.8, 0.0, -1.8]} rotation={[0, Math.PI / 5, 0]}>
                        <InnerDialogueVR
                            isFocused={focusedWidget === 'innerDialogue'}
                            onFocus={() => setFocusedWidget(focusedWidget === 'innerDialogue' ? null : 'innerDialogue')}
                        />
                    </group>
                )}

                {/* Chronos Nexus (Outer Left Wing) */}
                {openWidgets.chronosNexus && (
                    <group position={[-4.4, 1.0, -1.0]} rotation={[0, Math.PI / 3, 0]}>
                        <ChronosNexusVR
                            isFocused={focusedWidget === 'chronosNexus'}
                            onFocus={() => setFocusedWidget(focusedWidget === 'chronosNexus' ? null : 'chronosNexus')}
                        />
                    </group>
                )}

                {/* Quantum Weaver (Outer Right Wing) */}
                {openWidgets.quantumWeaver && (
                    <group position={[4.4, 1.0, -1.0]} rotation={[0, -Math.PI / 3, 0]}>
                        <QuantumWeaverVR
                            isFocused={focusedWidget === 'quantumWeaver'}
                            onFocus={() => setFocusedWidget(focusedWidget === 'quantumWeaver' ? null : 'quantumWeaver')}
                        />
                    </group>
                )}

                {/* Liquid Glass Orb (Central Core Background) */}
                <LiquidGlass position={[0, 1.5, -4.5]} scale={0.7} />

            </LocomotionWrapper>

            {/* ════ MEDITATION OVERLAY (renders on top when active) ════ */}
            {showMeditation && (
                <MeditationExperience onClose={() => setActiveExperience(null)} />
            )}
        </>
    );
}

// ═══════════════════════════════════════════
// Main App
// ═══════════════════════════════════════════

function App() {
    return (
        <div id="vr-app">
            <div className="vr-entry-overlay">
                <h1 className="vr-title">EARTHSHIFT // VR</h1>
                <p className="vr-subtitle">Sovereign OS Command Center</p>
                <div className="vr-buttons">

                    <button className="vr-btn vr-btn--vr" onClick={() => {
                        const el = document.querySelector('.vr-entry-overlay');
                        if (el) el.classList.add('hidden');
                        xrStore.enterVR();
                    }}>
                        <span className="vr-btn__dot vr-btn__dot--vr" /> ENTER VR
                    </button>
                </div>
                <p className="vr-hint">
                    Grab panel borders to reposition — Click center to interact — R-stick: Move — L-stick: Scale
                </p>
            </div>

            <Canvas
                camera={{ position: [0, 1.6, 3], fov: 60 }}
                gl={{ antialias: true }}
                dpr={1}
            >
                <XR store={xrStore}>
                    <Suspense fallback={null}>
                        <VRCockpit />
                    </Suspense>
                </XR>
            </Canvas>
        </div>
    );
}

export default App;
