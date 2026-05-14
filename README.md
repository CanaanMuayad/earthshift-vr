# EarthShift VR — Sovereign OS Command Center

Standalone WebXR dashboard for the EarthShift platform. Built with **Vite + React Three Fiber + @react-three/xr** for Meta Quest 3.

## Features
- 🥽 Immersive VR cockpit with 6 interactive glass panels
- 🧘 Full meditation breathing experience (Box, Relaxing, Mindful patterns)
- 🎮 Dual thumbstick locomotion + scaling
- ✋ Drag-to-reposition panels by grabbing borders
- 📊 Biometric ring gauges, emotional core sphere, progress tracking
- 🤖 Exocortex AI chat display

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in browser. For Quest 3, expose via HTTPS tunnel:

```bash
ssh -R 80:localhost:5173 nokey@localhost.run
```

## Controls (Quest 3)
- **Right thumbstick**: Move (X/Z translation)
- **Left thumbstick**: Scale (push up = bigger)
- **Point + click center**: Interact with widget
- **Point + grab border**: Drag to reposition

## Tech Stack
- [Vite](https://vite.dev) — Bundler
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) — 3D framework
- [@react-three/xr](https://github.com/pmndrs/xr) — WebXR
- [Zustand](https://github.com/pmndrs/zustand) — State management
- [Three.js](https://threejs.org) — 3D engine

## Project Structure
```
src/
├── App.tsx              # Main app + cockpit layout
├── components/
│   ├── GlassPanel.tsx   # Draggable glass panel primitive
│   ├── Locomotion.tsx   # XR store + thumbstick controls
│   └── VRButton.tsx     # Clickable 3D button
├── widgets/
│   ├── ExocortexVR.tsx       # AI chat panel
│   ├── IntentionVR.tsx       # Sacred intentions + candle
│   ├── BiometricVR.tsx       # Heart rate / HRV / stress rings
│   ├── ProgressVR.tsx        # Daily score + streaks
│   ├── EmotionalCoreVR.tsx   # Emotion sphere
│   └── MeditationExperience.tsx  # Full breathing session
└── store/
    └── vrStore.ts       # Zustand state
```
