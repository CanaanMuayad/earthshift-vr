# EarthShift VR — The Immersive Command Center Vision

## Architectural Philosophy

The VR version of EarthShift is NOT a flat dashboard projected into 3D space. It is a **spatial cockpit** — a personal command center that surrounds the user, where each widget is a living 3D instrument that can be grabbed, repositioned, focused, and activated.

Think: **Iron Man's holographic workshop meets a Tibetan temple floating in space.**

---

## The Cockpit Layout

The user sits (or stands) at the center. Widgets are arranged in a semicircular arc at comfortable viewing angles:

```
                    ┌─────────────────────┐
                    │   EXOCORTEX (Alfred) │ ← Front center, eye-level
                    │   2.6m × 1.6m       │    The largest panel
                    └─────────────────────┘
                           ↑ 2.5m up, 2.5m back

    ┌─────────────┐                              ┌──────────────┐
    │  INTENTION   │                              │  EMOTIONAL   │
    │  CANDLE      │ ← Left, lower               │  CORE        │ ← Right, lower
    │  1.3m × 1.5m │                              │  1.4m × 1.2m │
    └─────────────┘                              └──────────────┘
         ↑ 1.0m up, 2.5m back                        ↑ 1.0m up, 2.5m back

  ┌──────────────┐                                    ┌──────────────┐
  │  MEDITATION  │ ← Far left wing                    │  BIOMETRIC   │ ← Far right wing
  │  AETHEL      │   Rotated 36° inward               │  INSIGHTS    │   Rotated 36° inward
  │  1.4m × 1.2m │                                    │  1.4m × 1.2m │
  └──────────────┘                                    └──────────────┘
                                                      ┌──────────────┐
                                                      │  PROGRESS    │ ← Below biometric
                                                      │  TRACKING    │
                                                      │  1.4m × 1.2m │
                                                      └──────────────┘
```

### Key Principles
1. **Panels are NOT flat screens** — They are glass surfaces with depth, glow, and transparency
2. **Every panel can be grabbed (by its border) and repositioned**
3. **Clicking center of a panel** activates/focuses it, revealing interactive buttons
4. **Only one panel focused at a time** — focused panel glows brighter, shows action buttons
5. **The environment responds** — Background fog, ambient light, and color temperature shift based on the user's emotional state and active experience

---

## Experience Modes

The VR cockpit has two modes:

### 1. Cockpit Mode (Default)
All widgets visible in their positions. User browses, checks data, clicks buttons.

### 2. Experience Mode (Immersive)
A widget launches a full-screen takeover experience. The cockpit fades away (hidden, NOT destroyed) and the user enters an immersive environment:

| Trigger Widget | Experience | Description |
|---|---|---|
| Aethel Meditation | **Breathing Sphere** | Wireframe icosahedron + particle field + orbital rings. Expands/contracts with breathing pattern. Phase labels in space. Timer ring. |
| Inner Dialogue | **Affirmation Loop** | Floating text cards orbit the user. Each card illuminates when active. Binaural audio optional. |
| Quantum Weaver | **Future Memory Rehearsal** | The user's vision board images become a 360° environment. Guided narration with spatial audio. |
| Collective Field | **Global Meditation** | 3D globe at room scale, glowing meditation heatmap, join a live global session. |
| Habit Un-Maker | **Transformation Ritual** | Visual metaphor of the 4 phases: a tower being deconstructed and rebuilt. |

When the user clicks **← BACK**, the cockpit smoothly reappears. Camera doesn't reset. Everything is where they left it.

---

## Glass Panel Design Specification

Every panel in the VR cockpit uses the **GlassPanel** component:

### Visual Properties
- **Background**: Near-black with 25% opacity (`rgba(5, 15, 20, 0.25)`)
- **Border**: Glowing colored edge (1-2px wide) with Fresnel edge glow effect
- **Scanlines**: Subtle horizontal scanlines at 80px frequency for retro-futuristic feel
- **Depth**: Content sits 5cm in front of the glass surface
- **Double-sided rendering** for transparency at steep angles

### Interaction States
| State | Border Glow | Background Opacity | Scale |
|---|---|---|---|
| Default | 30% | 25% | 1.0 |
| Hovered | 60% | 35% | 1.0 |
| Focused/Active | 90% | 40% | 1.0 |
| Dragging | 100% + highlight | 30% | 0.98 |
| Pressed (button) | 100% | 45% | 0.92 |

### Dragging
- Grab near the **border edges** (12% margin) to drag
- Click the **center** to interact
- Panels maintain their new position until session ends
- Future: save positions to localStorage for persistence

---

## Color Language in VR

Colors are not decorative — they carry meaning:

| Color | Hex | Meaning | Used By |
|---|---|---|---|
| Emerald | `#22d07a` | Growth, confirmation, Alfred | Exocortex, Intention, Success states |
| Cyan/Teal | `#4fd1c5` | Calm, technology, flow | Progress, default accents, buttons |
| Violet | `#b794f6` | Spirituality, meditation, inner work | Meditation, Affirmation, Dissolve |
| Red/Coral | `#ff6b6b` | Warning, vitality, heart | Biometric, alerts, close buttons |
| Gold/Orange | `#ffa726` | Caution, hold, warmth | Hold phase, fire, warnings |
| White | `#ffffff` | Data, neutrality, text | All text, values |

---

## Locomotion & Controls

### Quest 3 Controller Mapping
| Input | Action |
|---|---|
| **Right thumbstick** (X/Z) | Translate cockpit left/right/forward/back |
| **Left thumbstick** (Y) | Scale cockpit (10%–500%) — push up = bigger, pull down = smaller |
| **Right trigger** | Click/Select (raycast from controller) |
| **Right grip** | Grab panel border to drag |
| **Left trigger** | Not yet mapped (future: voice input) |

### Desktop Fallback
- Mouse hover for panel highlighting
- Click for focus/interact
- Click-drag border to reposition
- Scroll wheel could control scale

---

## Audio Architecture for VR

### Meditation Audio
The main app has 11 theme MP3 files (150 seconds each, loopable) and 5 modifier effects:
- **Theme files**: `/audio/Music/Aethel - [Theme Name].mp3`
- **Effect files**: `/audio/Music/soundeffects/[effect].mp3`
- Volume: Theme 100%, Effects 50%, 1-second fade in/out

In VR, audio should be:
- **Spatial** — Sound sources positioned at the breathing sphere
- **Immersive** — Reverb + low-pass filter for "temple" atmosphere
- **Responsive** — Volume/filter cutoff responds to breathing phase

### Ambient Cockpit Audio (Future)
- Subtle hum in the background (spaceship cockpit ambience)
- Notification chimes when Alfred has a new briefing
- Click/hover sounds for UI feedback

---

## Environment & Atmosphere

### Cockpit Background
- Deep dark void: `#0a0f1e`
- Volumetric fog (8m near, 30m far) fading to black
- Subtle animated starfield or nebula (particle system)
- 3 colored point lights: cyan (front-right), violet (back-left), emerald (overhead)

### Meditation Background
- Even darker: `#020510`
- Dense fog closer in (5m)
- Only light source: the breathing sphere itself
- Particle motes floating slowly

### Emotional Response (Future)
The environment should eventually respond to the user's logged emotion:
- **Joyful**: Warm golden fog, brighter lighting
- **Calm**: Cool blue-green, gentle particle flow
- **Anxious**: Slightly more particle activity, subtle red tinge
- **Focused**: Minimal particles, sharp lighting, clean void

---

## Technical Stack

### Current Implementation
- **Vite** + **React** + **TypeScript**
- **React Three Fiber** (R3F) — React renderer for Three.js
- **@react-three/xr** — WebXR bindings for R3F
- **@react-three/drei** — Utility components (Text, etc.)
- **Zustand** — State management
- **Three.js** — 3D engine

### Key R3F Rules
1. All Three.js hooks (`useFrame`, `useThree`) must be called **inside** the `<Canvas>` tree
2. Never call `useFrame` in a component above the `<Canvas>`
3. XR store must be created with `createXRStore()` **outside** React render
4. Use `<XR store={xrStore}>` to wrap the scene
5. Prefer `useFrame` for animations over `requestAnimationFrame`

---

## Future Roadmap

### Phase 1 (Current) ✅
- [x] 6 interactive glass panels
- [x] Meditation breathing experience
- [x] Thumbstick locomotion + scaling
- [x] Panel dragging via borders
- [x] Focus system with action buttons

### Phase 2 (Next)
- [ ] Audio engine integration (play Aethel themes in VR)
- [ ] Affirmation Loop experience (Inner Dialogue VR)
- [ ] Voice input for Alfred ("Ask Alfred..." with speech recognition)
- [ ] Hand tracking support (Quest 3 native)
- [ ] Persistent panel positions (save/load layout)

### Phase 3 (Advanced)
- [ ] Future Memory Rehearsal (Quantum Weaver VR) — the flagship experience
- [ ] 3D Globe (Collective Field VR)
- [ ] Biometric wearable Bluetooth integration
- [ ] Emotional environment adaptation
- [ ] Spatial audio engine
- [ ] Multi-user meditation rooms

### Phase 4 (Dream)
- [ ] Full-body avatar with gesture tracking
- [ ] Neural interface compatibility (EEG headband → biometric widget)
- [ ] Procedurally generated meditation environments based on AI prompts
- [ ] Cross-device sync (VR cockpit ↔ desktop dashboard ↔ mobile app)
