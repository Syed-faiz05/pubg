import { create } from 'zustand';

const useGameStore = create((set, get) => ({
    // Auth / Player State
    playerName: 'Agent_007', // Default for now
    setPlayerName: (name) => set({ playerName: name }),
    playerId: null,
    setPlayerId: (id) => set({ playerId: id }),

    // App Navigation State
    currentView: 'home', // 'home' | 'match_setup' | 'lobby' | 'arena' | 'results' | 'profile'
    setCurrentView: (view) => set({ currentView: view }),

    // Game Session State
    gameState: {
        currentLevel: 1,
        maxLevels: 4,
        scores: [], // [85, 92, ...]
        totalScore: 0,
        matchId: null,
    },

    // Actions
    resetGame: () => set((state) => ({
        gameState: { ...state.gameState, currentLevel: 1, scores: [], totalScore: 0 }
    })),

    advanceLevel: (roundScore) => set((state) => {
        const newScores = [...state.gameState.scores, roundScore];
        const newTotal = newScores.reduce((a, b) => a + b, 0) / newScores.length;

        return {
            gameState: {
                ...state.gameState,
                scores: newScores,
                totalScore: Math.round(newTotal),
                currentLevel: state.gameState.currentLevel + 1
            }
        };
    }),

    // Socket Status
    isConnected: false,
    setIsConnected: (status) => set({ isConnected: status }),
}));

export default useGameStore;
