import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR } from '@react-three/xr';
import { Text } from '@react-three/drei';
import { xrStore, useLocomotion } from './components/Locomotion';
import { ExocortexVR } from './widgets/ExocortexVR';
import { IntentionVR } from './widgets/IntentionVR';
import { BiometricVR } from './widgets/BiometricVR';
import { ProgressVR } from './widgets/ProgressVR';
import { EmotionalCoreVR } from './widgets/EmotionalCoreVR';
import { MeditationExperience } from './widgets/MeditationExperience';
import { GlassPanel } from './components/GlassPanel';
import { VRButton } from './components/VRButton';
import { useVRStore } from './store/vrStore';
import './App.css';

// ═══════════════════════════════════════════
// VR Cockpit Scene — always alive, meditation overlays on top
// ═══════════════════════════════════════════

function VRCockpit() {
    const { offset, scale, isPresenting } = useLocomotion();
    const [focusedWidget, setFocusedWidget] = useState<string | null>(null);
    const [activeExperience, setActiveExperience] = useState<string | null>(null);
    const meditation = useVRStore((s) => s.meditation);

    const showMeditation = activeExperience === 'meditation';

    return (
        <>
            {/* Environment — always present */}
            <color attach="background" args={[showMeditation ? '#020510' : '#0a0f1e']} />
            <fog attach="fog" args={[showMeditation ? '#020510' : '#0a0f1e', 8, 30]} />
            <ambientLight intensity={showMeditation ? 0.2 : 0.4} />

            {!showMeditation && (
                <>
                    <pointLight position={[3, 4, 3]} intensity={0.8} color="#4fd1c5" />
                    <pointLight position={[-3, 2, -3]} intensity={0.4} color="#b794f6" />
                    <pointLight position={[0, 6, 0]} intensity={0.3} color="#22d07a" />
                </>
            )}

            {/* ════ COCKPIT (hidden during meditation) ════ */}
            <group
                visible={!showMeditation}
                scale={isPresenting ? scale : 1}
                position={isPresenting ? [offset[0], offset[1], offset[2]] : [0, 0, 0]}
            >
                {/* Exocortex */}
                <group position={[0, 2.5, -2.5]}>
                    <ExocortexVR
                        isFocused={focusedWidget === 'exocortex'}
                        onFocus={() => setFocusedWidget(focusedWidget === 'exocortex' ? null : 'exocortex')}
                    />
                </group>

                {/* Intention */}
                <group position={[-0.9, 1.0, -2.5]}>
                    <IntentionVR
                        isFocused={focusedWidget === 'intention'}
                        onFocus={() => setFocusedWidget(focusedWidget === 'intention' ? null : 'intention')}
                    />
                </group>

                {/* Emotional Core */}
                <group position={[0.9, 1.0, -2.5]}>
                    <EmotionalCoreVR
                        isFocused={focusedWidget === 'emotional'}
                        onFocus={() => setFocusedWidget(focusedWidget === 'emotional' ? null : 'emotional')}
                    />
                </group>

                {/* Biometric */}
                <group position={[2.8, 1.5, -1.8]} rotation={[0, -Math.PI / 5, 0]}>
                    <BiometricVR
                        isFocused={focusedWidget === 'biometric'}
                        onFocus={() => setFocusedWidget(focusedWidget === 'biometric' ? null : 'biometric')}
                    />
                </group>

                {/* Progress */}
                <group position={[2.8, 0.0, -1.8]} rotation={[0, -Math.PI / 5, 0]}>
                    <ProgressVR
                        isFocused={focusedWidget === 'progress'}
                        onFocus={() => setFocusedWidget(focusedWidget === 'progress' ? null : 'progress')}
                    />
                </group>

                {/* Meditation Panel (Left Wing) */}
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

                {/* Floor label */}
                <Text
                    position={[0, -0.5, -2.0]}
                    fontSize={0.04}
                    color="rgba(255,255,255,0.2)"
                    anchorX="center"
                    letterSpacing={0.15}
                >
                    EARTHSHIFT // SOVEREIGN OS — VR COMMAND CENTER
                </Text>
            </group>

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
                    <button className="vr-btn vr-btn--ar" onClick={() => xrStore.enterAR()}>
                        <span className="vr-btn__dot" /> ENTER AR
                    </button>
                    <button className="vr-btn vr-btn--vr" onClick={() => xrStore.enterVR()}>
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
                dpr={[1, 2]}
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
