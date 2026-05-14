import { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { createXRStore } from '@react-three/xr';

/**
 * Shared XR Store for the VR app
 */
export const xrStore = createXRStore({
    hand: { model: false },
    controller: { model: false },
});

/**
 * Hook: Thumbstick locomotion + scaling
 * Right stick = move (X/Z), Left stick Y = scale
 */
export function useLocomotion() {
    const [offset, setOffset] = useState<[number, number, number]>([0, 0, 0]);
    const [scale, setScale] = useState(1.0);
    const [isPresenting, setIsPresenting] = useState(false);

    useFrame(({ gl }) => {
        const presenting = gl.xr?.isPresenting || false;
        if (presenting !== isPresenting) setIsPresenting(presenting);
        if (!presenting) return;

        const session = (xrStore.getState() as any).session;
        if (!session) return;

        let dx = 0, dz = 0, dScale = 0;

        session.inputSources.forEach((source: any) => {
            if (!source.gamepad || source.gamepad.axes.length < 2) return;

            const xAxis = source.gamepad.axes.length >= 4 ? 2 : 0;
            const yAxis = source.gamepad.axes.length >= 4 ? 3 : 1;
            const x = source.gamepad.axes[xAxis] || 0;
            const y = source.gamepad.axes[yAxis] || 0;

            if (source.handedness === 'right') {
                if (Math.abs(x) > 0.1) dx += x * 0.05;
                if (Math.abs(y) > 0.1) dz += y * 0.05;
            } else if (source.handedness === 'left') {
                if (Math.abs(y) > 0.1) dScale += y * -0.02;
            }
        });

        if (dx !== 0 || dz !== 0) {
            setOffset(prev => [prev[0] + dx, prev[1], prev[2] + dz]);
        }
        if (dScale !== 0) {
            setScale(prev => Math.min(Math.max(prev + dScale, 0.2), 5.0));
        }
    });

    return { offset, scale, isPresenting };
}
