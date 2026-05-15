import { create } from 'zustand';

/**
 * Shared data types that mirror the main EarthShift app's widget data.
 * The VR app reads this state; the main app writes it.
 */

export interface Intention {
    id: string;
    text: string;
    createdAt: string;
    isActive: boolean;
}

export interface BiometricData {
    heartRate: number;
    hrv: number;
    stress: number; // 0-10
    lastUpdated: string;
}

export interface MeditationStats {
    totalMinutes: number;
    streak: number;
    lastSession: string;
}

export interface EmotionalState {
    primary: string; // e.g. "calm", "focused", "anxious"
    intensity: number; // 0-10
    color: string; // hex
}

export interface ProgressData {
    dailyScore: number; // 0-100
    weekStreak: number;
    completedToday: number;
    totalToday: number;
}

export interface Briefing {
    id: string;
    type: 'morning' | 'midday' | 'evening';
    content: string;
    timestamp: string;
    isRead: boolean;
}

export interface Affirmation {
    id: string;
    statement: string;
    emotionalCharge: string;
}

export interface FutureMemory {
    id: string;
    title: string;
    visionImageUrl?: string;
    emotions: string[];
}

export interface VRDashboardState {
    // Widget data
    intentions: Intention[];
    biometrics: BiometricData;
    meditation: MeditationStats;
    emotional: EmotionalState;
    progress: ProgressData;
    exocortexMessages: { role: 'user' | 'assistant'; content: string }[];
    briefings: Briefing[];
    affirmations: Affirmation[];
    futureMemories: FutureMemory[];

    // VR state
    activePanel: string | null;
    setActivePanel: (id: string | null) => void;

    // Actions
    loadFromStorage: () => void;
}

/**
 * Main VR Dashboard Store
 * Reads data from localStorage (shared with the main EarthShift app)
 */
export const useVRStore = create<VRDashboardState>((set) => ({
    // Default mock data (replaced when loading from storage)
    intentions: [
        { id: '1', text: 'Embody sovereign presence in every interaction', createdAt: '2026-05-14', isActive: true },
        { id: '2', text: 'Complete the Ark synthesis by end of week', createdAt: '2026-05-13', isActive: true },
        { id: '3', text: 'Practice 20 minutes of breathwork daily', createdAt: '2026-05-12', isActive: false },
    ],
    biometrics: {
        heartRate: 68,
        hrv: 52,
        stress: 3,
        lastUpdated: new Date().toISOString(),
    },
    meditation: {
        totalMinutes: 2340,
        streak: 14,
        lastSession: '2026-05-14T08:00:00Z',
    },
    emotional: {
        primary: 'Focused',
        intensity: 7,
        color: '#4fd1c5',
    },
    progress: {
        dailyScore: 73,
        weekStreak: 5,
        completedToday: 4,
        totalToday: 7,
    },
    exocortexMessages: [
        { role: 'assistant', content: 'Good evening, Commander. Your vitals show strong coherence. Cycle alignment at 87%.' },
        { role: 'user', content: 'What should I focus on tonight?' },
        { role: 'assistant', content: 'Based on your current trajectory, I recommend completing the Quantum Weaver session and reviewing tomorrow\'s cycle convergence.' },
    ],
    briefings: [
        { id: '1', type: 'evening', content: 'Your evening synthesis is ready. The 80-year cycle shows peak alignment tomorrow. Prepare accordingly.', timestamp: '2026-05-14T20:00:00Z', isRead: false },
        { id: '2', type: 'midday', content: 'Midday check-in. Vitals indicate slight tension. Consider a brief somatic reset.', timestamp: '2026-05-14T12:00:00Z', isRead: true }
    ],
    affirmations: [
        { id: '1', statement: 'I am the sovereign architect of my reality.', emotionalCharge: 'Empowered' },
        { id: '2', statement: 'My body is a vessel for infinite cosmic energy.', emotionalCharge: 'Radiant' }
    ],
    futureMemories: [
        { id: '1', title: 'The Launch of EarthShift', emotions: ['Pride', 'Relief', 'Awe'] },
        { id: '2', title: 'Global Coherence Event', emotions: ['Unity', 'Peace'] }
    ],

    activePanel: null,
    setActivePanel: (id) => set({ activePanel: id }),

    loadFromStorage: () => {
        try {
            // Try reading from shared localStorage
            const stored = localStorage.getItem('earthshift-vr-state');
            if (stored) {
                const parsed = JSON.parse(stored);
                set(parsed);
            }
        } catch (e) {
            console.warn('[VR Store] Could not load from storage:', e);
        }
    },
}));
