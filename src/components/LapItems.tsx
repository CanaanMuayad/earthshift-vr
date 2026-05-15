import { Suspense } from 'react';
import { GLBModel } from './GLBModel';

interface LapItemsProps {
    openWidgets: Record<string, boolean>;
    toggleWidget: (id: string) => void;
}

export function LapItems({ openWidgets, toggleWidget }: LapItemsProps) {
    return (
        <group position={[0, 1.0, 0]}>
            <Suspense fallback={null}>
                {/* Exocortex - Alfred */}
                <group position={[-2, 0, -1.5]}>
                    <GLBModel 
                        url="/alfred.glb" 
                        scale={openWidgets.exocortex ? 0.45 : 0.4} 
                        rotateSpeed={0.5}
                        hoverScale={1.15}
                        onClick={() => toggleWidget('exocortex')} 
                    />
                </group>

                {/* Quantum Weaver - Celestial Helix */}
                <group position={[-1, 0, -2.2]}>
                    <GLBModel 
                        url="/celectial-helix.glb" 
                        scale={openWidgets.quantumWeaver ? 0.45 : 0.4} 
                        rotateSpeed={0.5}
                        hoverScale={1.15}
                        onClick={() => toggleWidget('quantumWeaver')} 
                    />
                </group>

                {/* Chronos Nexus - Hourglass */}
                <group position={[0, 0, -2.5]}>
                    <GLBModel 
                        url="/hourglass.glb" 
                        scale={openWidgets.chronosNexus ? 0.45 : 0.4} 
                        rotateSpeed={0.5}
                        hoverScale={1.15}
                        onClick={() => toggleWidget('chronosNexus')} 
                    />
                </group>

                {/* Biometrics - Human Anatomy */}
                <group position={[1, 0, -2.2]}>
                    <GLBModel 
                        url="/human-anatomy.glb" 
                        scale={openWidgets.biometric ? 0.45 : 0.4} 
                        rotateSpeed={0.5}
                        hoverScale={1.15}
                        onClick={() => toggleWidget('biometric')} 
                    />
                </group>

                {/* Intention - Pole */}
                <group position={[2, 0, -1.5]}>
                    <GLBModel 
                        url="/pole.glb" 
                        scale={openWidgets.intention ? 0.45 : 0.4} 
                        rotateSpeed={0.5}
                        hoverScale={1.15}
                        onClick={() => toggleWidget('intention')} 
                    />
                </group>
            </Suspense>
        </group>
    );
}
