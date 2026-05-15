import { Stars, Grid } from '@react-three/drei';
import * as THREE from 'three';

import { useTexture } from '@react-three/drei';

function Skydome() {
    const texture = useTexture('/cybernetic_skydome.png');
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(1, 1);

    return (
        <mesh position={[0, -0.01, 0]}>
            <sphereGeometry args={[45, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </mesh>
    );
}

// ═══════════════════════════════════════════
// Environment Component
// ═══════════════════════════════════════════
export function Environment({ showMeditation }: { showMeditation: boolean }) {
    return (
        <>
            <color attach="background" args={[showMeditation ? '#020510' : '#0a0f1e']} />
            <fog attach="fog" args={[showMeditation ? '#020510' : '#0a0f1e', 8, 30]} />
            <ambientLight intensity={showMeditation ? 0.2 : 0.4} />

            {!showMeditation && (
                <>
                    <pointLight position={[0, 6, 0]} intensity={1.5} color="#4fd1c5" />
                </>
            )}

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Skydome />

            {/* Glowing Grid Floor */}
            <Grid
                position={[0, 0, 0]}
                args={[60, 60]}
                cellSize={0.5}
                cellThickness={1.5}
                cellColor="#24808c"
                sectionSize={2.5}
                sectionThickness={2}
                sectionColor="#4fd1c5"
                fadeDistance={30}
                fadeStrength={1}
                raycast={() => null}
            />

            {/* Solid floor plane to hide lower stars/nebula */}
            <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
                <circleGeometry args={[100, 64]} />
                <meshBasicMaterial color={showMeditation ? '#010208' : '#050810'} side={THREE.DoubleSide} />
            </mesh>

            {/* Glowing Horizon Ring / Border */}
            <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
                <ringGeometry args={[29.5, 30, 64]} />
                <meshBasicMaterial color="#4fd1c5" transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>
        </>
    );
}
