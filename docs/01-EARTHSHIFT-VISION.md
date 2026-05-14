# EarthShift.ai — The Complete Vision

## What Is EarthShift?

EarthShift is a **Sovereign Operating System for Consciousness Evolution** — a deeply personal digital command center that integrates meditation, biometrics, AI guidance, subconscious reprogramming, habit transformation, emotional tracking, and cosmic cycle visualization into a single unified platform. It is NOT a generic wellness app. It is an **Exocortex** — an external extension of the user's cognitive and spiritual self.

The platform is designed around one core belief: **We are living through the most significant convergence of cosmic, economic, historical, and biological cycles in recorded history (2024–2028).** EarthShift helps the user navigate this window consciously.

---

## The User (Architect)

The creator is a visionary building this for personal use first, with the intent to eventually open it to others. Think of it as an Iron Man's JARVIS meets a monk's temple — a system that:
- Knows your emotional state
- Tracks your body's biometrics
- Guides your meditation practice with AI-generated music
- Helps you rewrite limiting beliefs at the subconscious level
- Visualizes the mathematical cycles governing civilizations
- Provides AI-powered daily briefings tuned to your context
- Displays a global consciousness field showing who else is meditating right now

---

## Core Philosophy: "Sovereign OS"

The design language is called **Sovereign OS** or **Nexus Flow**. It is:
- **Dark** — Deep void backgrounds (#050b14)
- **Glassmorphic** — Translucent panels with blur, glow borders
- **Alive** — Pulsing, breathing animations; nothing is ever static
- **Sacred** — Sacred geometry patterns, candle metaphors, ceremonial language
- **Cyan/Emerald** — The primary palette is teal-cyan (#4fd1c5) and emerald-green (#22d07a) with violet (#b794f6) accents

### CSS Design Tokens
```css
--sov-bg: #050b14;              /* Void background */
--sov-panel-bg: rgba(5, 15, 20, 0.45);  /* Glass panel */
--sov-border: rgba(34, 208, 122, 0.3);  /* Emerald borders */
--sov-cyan: #4fd1c5;            /* Primary accent */
--sov-emerald: #22d07a;         /* Secondary accent */
--sov-glow-cyan: 0 0 15px rgba(79, 209, 197, 0.5);
--sov-glow-emerald: 0 0 15px rgba(34, 208, 122, 0.5);
--sov-warning: #eab308;         /* Warning gold */
--sov-alert: #ff6b6b;           /* Alert red */
```

### Typography
- **Headers**: Manrope, extrabold, often with gradient text
- **Body**: Inter, regular/medium
- **UI Labels**: DM Sans, semibold, uppercase with wide letter-spacing (0.1em+)

---

## The Dashboard Architecture

The main application is a **Next.js** web app with a 3-column glassmorphic grid layout:

```
┌──────────────────────────────────────────────────────────┐
│                    MASTER HEADER                         │
│  (System status, user avatar, notifications, time)       │
├────────────┬──────────────────────┬──────────────────────┤
│  LEFT      │     CENTER           │     RIGHT            │
│  COLUMN    │     COLUMN           │     COLUMN           │
│  (320px)   │     (flex)           │     (320px)          │
│            │                      │                      │
│ Intention  │  Exocortex (Alfred)  │  Biometric Insights  │
│ Candle     │  AI Chat Interface   │  Heart Rate / HRV    │
│            │                      │  Stress Level        │
│ Emotional  │  Chronos Nexus       │                      │
│ Core Node  │  Daily Briefings     │  Progress Tracking   │
│            │                      │  Daily Score / Streak│
│ Somatic    │  Inner Dialogue      │                      │
│ Micro-Log  │  Affirmation Engine  │  Habit Un-Maker      │
│            │                      │  4-Step Transform    │
│ Quick      │  Quantum Weaver      │                      │
│ Actions    │  Future Memories     │  Collective Field    │
│            │                      │  Global Globe        │
│ Aethel     │                      │                      │
│ Meditation │                      │                      │
└────────────┴──────────────────────┴──────────────────────┘
```

---

## The AI Entity: Alfred

Alfred is the **Exocortex Guide** — an AI assistant that lives at the center of the dashboard. It is NOT just a chatbot. Alfred:
- Knows the user's emotional state (from the Emotional Core widget)
- Reads biometric data (HRV, heart rate, stress levels)
- Generates personalized daily briefings (morning, midday, evening via Chronos Nexus)
- Can trigger meditation sessions remotely (`window.dispatchEvent('aethel:start')`)
- Understands the cosmic cycle convergence and relates it to the user's personal journey
- Uses a **system prompt** that positions it as a wise, sovereign advisor — never clinical, always respectful of the user's inner work

Alfred speaks in a tone that is:
- Calm, never rushed
- Uses metaphor and archetype
- References the user's active intentions, emotional state, and biometric readings
- Treats each interaction as sacred

---

## Data & State Architecture

### Backend
- **Firebase Firestore** — All user data (briefings, intentions, emotions, habits, affirmations, meditation sessions)
- **Firebase Auth** — Google/Email authentication
- **SQLite (local)** — Offline-first data layer for desktop (Tauri build)
- **Zustand** — Client-side state management

### The VR App (this project)
- Uses **Zustand** stores with mock data
- Designed to eventually sync with the main app via localStorage bridge or WebSocket
- Should remain self-contained and runnable independently

---

## Key Convergence: The 2024–2028 Window

EarthShift tracks 83+ mathematical cycles across 5 categories. The platform's thesis is that an unprecedented number of these cycles are peaking simultaneously:

### Categories
1. **Meta-Cosmic** — 1500-year Civilizational cycle, 24000-year Yuga
2. **Cosmic/Solar** — Schwabe (11yr), Hale (22yr), Gleissberg (87yr), Hallstatt (2400yr)
3. **Historical** — Dewey War cycles, 80-year Saeculum (Fourth Turning), 250-year Empire decline
4. **Economic** — Kitchin (3.3yr), Juglar (11yr), Kondratiev K-Wave (60yr), Debt Super-Cycle (80yr)
5. **Biological** — Brainwave states, heart coherence, Circadian rhythm, Schumann resonance

All visualized as `f(t) = A sin(ωt + φ)` harmonic functions on the 3D Cosmic Clock and Cosmic Pyramid.
