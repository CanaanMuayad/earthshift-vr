import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { createXRStore } from '@react-three/xr';
import * as THREE from 'three';

/**
 * Shared XR Store for the VR app
 */
export const xrStore = createXRStore({
    hand: { model: false },
    controller: { model: false },
});

/**
 * Wrapper: Thumbstick locomotion + scaling via direct ref mutation (Zero React Overhead)
 * Right stick = move (X/Z), Left stick = Y (up/down) and scale
 */
export function LocomotionWrapper({ children, showMeditation }: { children: React.ReactNode, showMeditation: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const [isPresenting, setIsPresenting] = useState(false);

    useFrame(({ gl }) => {
        const presenting = gl.xr?.isPresenting || false;
        if (presenting !== isPresenting) setIsPresenting(presenting);
        if (!presenting || !groupRef.current) return;

        const session = (xrStore.getState() as any).session;
        if (!session) return;

        let dx = 0, dy = 0, dz = 0;

        session.inputSources.forEach((source: any) => {
            if (!source.gamepad || source.gamepad.axes.length < 2) return;

            const xAxis = source.gamepad.axes.length >= 4 ? 2 : 0;
            const yAxis = source.gamepad.axes.length >= 4 ? 3 : 1;
            const x = source.gamepad.axes[xAxis] || 0;
            const y = source.gamepad.axes[yAxis] || 0;

            if (source.handedness === 'right') {
                if (Math.abs(x) > 0.1) dx += x * -0.05;
                if (Math.abs(y) > 0.1) dz += y * -0.05;
            } else if (source.handedness === 'left') {
                if (Math.abs(x) > 0.1) dy += x * -0.05;
                // scale logic removed
            }
        });

        if (dx !== 0 || dy !== 0 || dz !== 0) {
            groupRef.current.position.x += dx;
            groupRef.current.position.y += dy;
            groupRef.current.position.z += dz;

            // Floor boundary: Prevent player from going under the floor
            // World moves UP (+y) when player moves DOWN.
            // If world's Y is > 0, player is below ground! Clamp it.
            if (groupRef.current.position.y > 0) {
                groupRef.current.position.y = 0;
            }
        }
        
        // Remove scaling logic to prevent exponential scaling of models
        // if (dScale !== 0) {
        //     const newScale = Math.min(Math.max(groupRef.current.scale.x + dScale, 0.2), 5.0);
        //     groupRef.current.scale.set(newScale, newScale, newScale);
        // }
    });

    return (
        <group
            ref={groupRef}
            visible={!showMeditation}
        >
            {children}
        </group>
    );
}
