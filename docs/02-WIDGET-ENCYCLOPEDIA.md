# EarthShift Dashboard Widgets — Complete Reference

Every widget in EarthShift is a living instrument. Each one has a specific consciousness-evolution purpose, a visual identity, data model, and interaction pattern. Below is the exhaustive inventory.

---

## 1. Aethel Meditation (🧘 `aethel-meditation`)
**Category**: Meditation | **Color**: Theme-dependent | **Priority**: P0

### Purpose
AI-powered meditation music generator with breathing guidance. Named "Aethel" — the platform's meditation engine.

### Features
- **11 Themed Soundscapes**: Calm River, Gentle Rain, Deep Forest, Ocean Waves, Zen Garden, and 6 Solfeggio frequencies (432Hz, 528Hz, 639Hz, 741Hz, 852Hz, 963Hz)
- **Sound Modifiers**: Layerable effects — Gentle Wind, Wind Chimes, Crackling Fire, Babbling Brook, Distant Thunder, Solo Flute, Singing Bowl
- **Multi-Track Audio Engine**: Loops 150-second MP3 files seamlessly, mixing base themes with modifier effects at configurable volumes
- **Breathing Guide**: Visual circle that expands/contracts with breathing patterns:
  - **Box Breathing** (4-4-4-4): Equal inhale, hold, exhale, hold out
  - **Relaxing Breath** (4-7-8): Long exhale for parasympathetic activation
  - **Mindful Breathing** (5-0-7-0): Simple in/out for presence
- **Session Timer**: Configurable duration (5, 10, 15, 20, 30, 45, 60 minutes)
- **Expand to Full Page**: Navigates to `/meditation` for immersive fullscreen experience
- **Remote Trigger**: Other widgets (Alfred) can fire `aethel:start` custom events to auto-launch sessions

### VR Translation
The meditation widget is the **most critical VR experience**. In VR it should become:
- A fully immersive breathing sphere (wireframe icosahedron + orbital rings + particle field)
- The sphere breathes with the user — expanding on inhale, contracting on exhale
- Phase labels float in space: "BREATHE IN", "HOLD", "BREATHE OUT"
- Color shifts per phase: cyan (inhale) → violet (hold) → green (exhale) → orange (hold out)
- Pattern selector as floating 3D buttons
- Timer ring surrounding the sphere
- Audio engine plays the themed soundscapes

### Data Model
```typescript
interface AethelTheme {
  id: string;        // 'river', 'rain', 'forest', '432hz', etc.
  name: string;
  description: string;
  prompt: string;     // AI generation prompt
  color: string;      // Hex color for UI
  category: 'nature' | 'ambient' | 'frequency';
}

interface BreathingTechnique {
  id: string;
  name: string;
  pattern: { inhale: number; hold: number; exhale: number; holdOut: number };
}
```

---

## 2. Exocortex / Alfred AI (🤖 `ai-welcome`)
**Category**: Core | **Color**: #22d07a (emerald) | **Priority**: P0

### Purpose
The central AI chat interface — the user's digital advisor, named "Alfred." Positioned at the center of the dashboard.

### Features
- Real-time streaming chat with context-aware responses
- Knows the user's current emotional state, biometrics, and active intentions
- Generates insight cards that float as overlapping notifications
- Can trigger other widgets (start meditation, suggest affirmations)
- Supports multiple AI providers (local Ollama, OpenAI, Anthropic)

### VR Translation
- Large central glass panel showing the last 3-5 messages
- In the future: voice input/output for hands-free interaction
- Insight cards as floating holographic post-its around the panel

### Data Model
```typescript
interface ExocortexMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

---

## 3. Chronos Nexus (⏰ `chronos-nexus`)
**Category**: Tracking | **Color**: Varies by time-of-day | **Priority**: P1

### Purpose
AI-generated daily briefings — morning motivation, midday check-in, evening reflection. Powered by the "Daily Synthesis Algorithm."

### Features
- Real-time Firestore listener for new briefings
- Mark-as-read functionality
- Briefing history modal
- Persona-based generation (Alfred's voice)
- Suggested actions per briefing

### VR Translation
- Scrollable text panel showing the latest briefing
- Time-of-day indicator (sun/moon icon)
- "Read full briefing" button that expands the panel

### Data Model
```typescript
interface AIBriefing {
  id: string;
  type: 'morning' | 'midday' | 'evening';
  content: string;
  timestamp: Date;
  isRead: boolean;
  suggestedActions: string[];
}
```

---

## 4. Intention Candle (🕯️ `intention`)
**Category**: Meditation | **Color**: #22d07a | **Priority**: P0

### Purpose
A sacred space for setting and holding daily intentions. Visualized as a candle flame that flickers based on the user's focus.

### Features
- Create/edit intentions with text
- Active intentions displayed as a glowing list
- Candle flame animation (procedural flicker)
- Mark intentions as completed
- History tracking

### VR Translation
- 3D candle with procedural flame (mesh + point light)
- Intentions floating as glowing text cards around the candle
- "Begin Intention Ritual" button for a guided experience
- Flame intensity reflects how many intentions are active

### Data Model
```typescript
interface Intention {
  id: string;
  text: string;
  isActive: boolean;
  createdAt: Date;
  completedAt?: Date;
}
```

---

## 5. Emotional Core Node (🧠 `emotional-core`)
**Category**: Core | **Color**: Dynamic (emotion-dependent) | **Priority**: P0

### Purpose
Real-time emotional state tracking. The user logs their current emotion, and the widget's visual identity changes to match.

### Features
- Primary emotion selector (Joy, Calm, Focus, Anxiety, Sadness, etc.)
- Intensity slider (1-10)
- Color mapping per emotion
- Emotional history timeline
- Somatic body-map integration

### VR Translation
- Wireframe icosahedron sphere that changes color based on emotion
- Scale/rotation speed responds to intensity
- Glow aura matches the emotion color
- "Log Emotion Check-In" button

### Data Model
```typescript
interface EmotionalState {
  primary: string;      // 'Joy', 'Calm', 'Focus', etc.
  intensity: number;    // 1-10
  color: string;        // Mapped hex color
  timestamp: Date;
}
```

---

## 6. Biometric Insights (💓 `biometric`)
**Category**: Tracking | **Color**: #ff6b6b | **Priority**: P1

### Purpose
Heart rate, HRV (Heart Rate Variability), and stress level tracking from wearable devices.

### Features
- Ring gauges for HR, HRV, and Calm score
- Real-time updates from wearable API
- Historical trend charts
- Coherence detection

### VR Translation
- Three animated ring gauges (like speedometers)
- Pulsing animations synced to heart rate data
- "Connect Wearable" button for Bluetooth pairing

### Data Model
```typescript
interface Biometrics {
  heartRate: number;    // BPM
  hrv: number;          // Milliseconds
  stress: number;       // 1-10 (inverted for "calm" display)
}
```

---

## 7. Inner Dialogue (💬 `inner-dialogue`)
**Category**: Insights | **Color**: #4fd1c5 | **Priority**: P1

### Purpose
Subconscious reprogramming through affirmations and belief dissolution. Based on neurolinguistic programming principles.

### Features
- **Affirm Mode**: Create, edit, and loop affirmations with voice playback + binaural beats
- **Dissolve Mode**: Write down a limiting belief → watch it dissolve in a particle animation → create a replacement affirmation to "fill the vacuum"
- **Playlists**: Organize affirmations into themed playlists
- **Affirmation Forge**: 3-step wizard to craft powerful affirmations (Statement → Emotional Charge → Sensory Anchoring)
- **Loop Player**: Full-screen immersive player that cycles through affirmations

### VR Translation
- **Affirm**: Floating text cards with affirmations orbiting the user
- **Dissolve**: 3D particle disintegration effect when dissolving a belief
- **Loop Player**: Immersive sphere where affirmations appear as floating text, each one illuminating as it's spoken

### Data Model
```typescript
interface Affirmation {
  id: string;
  statement: string;
  emotionalCharge: string;
  sensoryAnchors: string[];
  playlists: string[];
  repeatCount: number;
}

interface BeliefLog {
  id: string;
  beliefText: string;
  status: 'LOGGED' | 'DISSOLVING' | 'DISSOLVED';
  replacementAffirmationId?: string;
}
```

---

## 8. Quantum Weaver (🎯 `quantum-weaver`)
**Category**: Goals | **Color**: Varies | **Priority**: P1

### Purpose
"Future Memory" creation and rehearsal — a manifestation tool where users build vivid mental scenes of their desired future and rehearse them.

### Features
- **Memory Library**: Browse all created future memories
- **Memory Builder**: 6-step wizard (Vision → Scene → Emotions → Sensory Details → Affirmation → Image Upload)
- **Rehearsal Player**: Full-screen immersive guided visualization that walks the user through their future memory with ambient audio

### VR Translation
- **THE killer VR feature** — Users build a virtual room/scene of their future memory and literally step inside it
- Vision board images as floating panels
- Guided narration with spatial audio
- The environment transforms to match the memory's emotional tone

---

## 9. Habit Un-Maker (🔄 `habit-unmaker`)
**Category**: Tracking | **Color**: #4fd1c5 | **Priority**: P1

### Purpose
Based on **Dr. Joe Dispenza's 4-step methodology** for conscious personality change:
1. **AWARENESS** — Identify the habit/pattern
2. **OBSERVING** — Watch it without reacting
3. **SURRENDERED** — Release the emotional charge
4. **TRANSFORMED** — New neural pathway established

### Features
- Program setup wizard (name the habit, set duration)
- Daily check-in system
- Progress dashboard with phase indicators
- Streak tracking

### VR Translation
- Phase indicator as a vertical progression (totem pole or ascending platforms)
- Daily check-in as a ritual interaction

---

## 10. Somatic Micro-Log (🌡️ `somatic-log`)
**Category**: Core | **Color**: Varies | **Priority**: P2

### Purpose
Quick body-sensation logging — "Where do you feel tension?" Uses a body map to mark areas of sensation.

### VR Translation
- 3D body silhouette the user can point at to mark sensations
- Heat map overlay showing chronic tension areas

---

## 11. Collective Field Monitor (🌍 `collective-field`)
**Category**: Social | **Color**: #22d07a | **Priority**: P2

### Purpose
Global consciousness visualization — a 3D globe showing who's meditating right now, with energy field indicators.

### Features
- WebGL 3D globe with heatmap regions
- Live participant count ("42 souls connected")
- Energy level indicator (Low/Medium/High)
- Collective meditation scheduling and joining
- Milestone celebrations (100+ meditators)

### VR Translation
- Full 3D globe floating in space, interactive rotation
- Glowing dots for active meditators
- Energy waves rippling across the surface

---

## 12. Progress Tracking (📊 `progress`)
**Category**: Tracking | **Color**: #4fd1c5 | **Priority**: P1

### Purpose
Daily alignment score, streak tracking, and completion metrics.

### Features
- Daily score (0-100%)
- Week streak counter
- Completed/Total tasks ratio
- Progress bar visualization

### VR Translation
- Large score display with animated ring gauge
- Streak flames
- "View Detailed Stats" expansion

---

## 13. Quick Actions (⚡ `quick-actions`)
**Category**: Insights | **Color**: #4fd1c5 | **Priority**: P2

### Purpose
One-tap shortcuts to common actions: start meditation, log emotion, set intention, etc.

### VR Translation
- Floating action buttons in a radial menu around the user's hand
