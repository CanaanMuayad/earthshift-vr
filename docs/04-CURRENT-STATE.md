# EarthShift VR — Current Implementation State

## What's Built (as of May 2026)

This document describes the exact state of the codebase so you know what exists and what doesn't.

---

## File Structure
```
earthshift-vr/
├── docs/
│   ├── 01-EARTHSHIFT-VISION.md          # Platform vision & philosophy
│   ├── 02-WIDGET-ENCYCLOPEDIA.md         # Complete widget reference
│   ├── 03-VR-COCKPIT-VISION.md          # VR design specification
│   └── 04-CURRENT-STATE.md              # This file
├── src/
│   ├── App.tsx                          # Main app, cockpit layout, experience routing
│   ├── App.css                          # Entry page styles (non-VR overlay)
│   ├── main.tsx                         # React entry point
│   ├── index.css                        # Base styles
│   ├── components/
│   │   ├── GlassPanel.tsx               # Core UI primitive — glassmorphic panel with dragging
│   │   ├── Locomotion.tsx               # XR store + thumbstick controls
│   │   └── VRButton.tsx                 # Clickable 3D button
│   ├── widgets/
│   │   ├── ExocortexVR.tsx              # Alfred AI chat display
│   │   ├── IntentionVR.tsx              # Sacred intentions + candle
│   │   ├── BiometricVR.tsx              # HR / HRV / Stress ring gauges
│   │   ├── ProgressVR.tsx               # Daily score + streaks
│   │   ├── EmotionalCoreVR.tsx          # Emotion sphere + intensity
│   │   └── MeditationExperience.tsx     # Full breathing session
│   └── store/
│       └── vrStore.ts                   # Zustand state with mock data
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## Component Details

### `App.tsx` — Scene Orchestrator
- Creates the R3F `<Canvas>` with XR support
- Manages two modes: **Cockpit** (all widgets visible) and **Meditation** (overlay)
- Cockpit uses `visible={!showMeditation}` so it stays alive during experiences
- Entry overlay with AR/VR buttons (desktop fallback)

### `GlassPanel.tsx` — Core Panel Primitive
- Custom GLSL shader: Fresnel edge glow, scanlines, hover/active/drag states
- **Draggable**: Pointer near edges (12% margin) enters drag mode
- **Clickable**: Center clicks pass through to `onClick`
- Props: `size`, `baseColor`, `hoverColor`, `isActive`, `draggable`, `onDrag`

### `Locomotion.tsx` — XR Controls
- Creates `xrStore` via `createXRStore()`
- `useLocomotion()` hook reads gamepad axes every frame
- Right stick: X/Z translation (movement)
- Left stick: Y-axis scaling (10%–500%)
- Returns: `{ offset, scale, isPresenting }`

### `VRButton.tsx` — Interactive Button
- Rectangular plane with border outline and text label
- Hover: scale up 5%, color fill
- Press: scale down 8%, immediate feedback
- Raycast-compatible for VR controllers

### `vrStore.ts` — State Management
Currently uses **mock data**:
```typescript
{
  exocortexMessages: [
    { role: 'assistant', content: 'Good evening, Sovereign...', timestamp: Date },
    { role: 'user', content: 'Run evening protocol', timestamp: Date },
    { role: 'assistant', content: 'Initiating evening synthesis...', timestamp: Date },
  ],
  intentions: [
    { id: '1', text: 'Maintain inner stillness...', isActive: true },
    { id: '2', text: 'Complete the VR cockpit...', isActive: true },
  ],
  biometrics: { heartRate: 68, hrv: 42, stress: 3 },
  emotional: { primary: 'Focused', intensity: 7, color: '#4fd1c5' },
  progress: { dailyScore: 78, weekStreak: 12, completedToday: 5, totalToday: 7 },
  meditation: { totalMinutes: 1250, streak: 28, lastSession: '2026-05-14' },
}
```

---

## What Works

1. ✅ Enter VR/AR from browser
2. ✅ 6 panels render with glass shader effect
3. ✅ Click panel center → focus it (border brightens, action button appears)
4. ✅ Click panel border → drag to reposition
5. ✅ Meditation panel → "Begin Session" → full breathing experience
6. ✅ Breathing sphere animates with phase (inhale/hold/exhale)
7. ✅ 3 breathing patterns selectable (Box, Relaxing, Mindful)
8. ✅ Timer ring shows elapsed time
9. ✅ "← BACK" returns to cockpit without loss
10. ✅ Right thumbstick moves cockpit
11. ✅ Left thumbstick scales cockpit
12. ✅ Desktop mouse fallback works

---

## What's NOT Built Yet

### Widgets Missing VR Versions
- [ ] **Chronos Nexus** (daily briefings)
- [ ] **Inner Dialogue** (affirmations + dissolve)
- [ ] **Quantum Weaver** (future memories)
- [ ] **Habit Un-Maker** (4-step transformation)
- [ ] **Somatic Micro-Log** (body sensation map)
- [ ] **Collective Field** (3D globe)
- [ ] **Quick Actions** (radial menu)

### Features Not Implemented
- [ ] Audio playback (no Aethel themes playing yet)
- [ ] Voice input for Alfred
- [ ] Real data sync (currently mock data only)
- [ ] Hand tracking (controllers only)
- [ ] Persistent panel positions
- [ ] Starfield/nebula background
- [ ] Ambient cockpit audio
- [ ] Notification system
- [ ] Settings panel (adjust scale, opacity, etc.)

### Known Issues
- `THREE.Color` warnings for `rgba()` values (functional but noisy)
- Deprecated Zustand `create` warning
- Panel dragging in VR requires ray intersection accuracy tuning
- No haptic feedback on button press

---

## Dependencies

```json
{
  "@react-three/drei": "^9.121.0",
  "@react-three/fiber": "^9.1.2",
  "@react-three/xr": "^6.6.14",
  "react": "^19.1.0",
  "three": "^0.175.0",
  "zustand": "^5.0.5"
}
```

Dev: Vite 6.3.5, TypeScript 5.8.3, ESLint

---

## How to Run

```bash
# Install
npm install

# Dev server (desktop)
npm run dev
# → http://localhost:5173

# For Quest 3 (HTTPS required for WebXR)
ssh -R 80:localhost:5173 nokey@localhost.run
# → Copy the https://*.lhr.life URL to Quest browser
```

---

## Integration Points with Main App

The main EarthShift app (16GB Next.js + Tauri) stores all user data in **Firebase Firestore**. The VR app is currently standalone with mock data. Future sync options:

1. **localStorage bridge** — Both apps on same origin, share localStorage
2. **Firebase SDK** — VR app imports Firebase directly (adds ~200KB)
3. **REST API** — VR app fetches from Firebase REST endpoints
4. **WebSocket bridge** — Real-time bidirectional sync via a lightweight server

The recommended path is **Firebase SDK** for simplicity, but only after the VR UX is finalized.
