# Prompt Battle Arena - Implementation Plan

## 1. System Architecture

This project will follow a **Monorepo** structure to ensure type safety and shared logic between the frontend and backend, while keeping concerns separated.

### Directory Structure
```
/pubg
  /client          (Frontend: Vite + React)
  /server          (Backend: Node.js + Express + Socket.io)
  /shared          (Shared types, constants, validation logic)
  /docs            (Documentation & Design Specs)
```

## 2. Frontend Architecture (Client)

**Tech Stack:**
- **Framework:** React (Vite) for high-performance SPA.
- **State Management:** Zustand (lightweight, perfect for game state).
- **Styling:** Vanilla CSS (CSS Variables for theming, strictly following design goals).
- **Real-time:** Socket.io Client.
- **Routing:** React Router.

**Modules:**
1.  **Core Game Engine:** Handles the 4-level loop, timer synchronization, and API submission.
2.  **UI Components:** Atomic design system (Buttons, Cards, Inputs) with a "Futuristic/Esports" aesthetic.
3.  **Views:**
    *   `HomeDashboard`: Landing + Queue status.
    *   `MatchLobby`: Waiting for players, map/mode vote.
    *   `InGameArena`: The main battle interface.
    *   `Results`: Post-game analytics.

## 3. Backend Architecture (Server)

**Tech Stack:**
- **Runtime:** Node.js.
- **Framework:** Express.
- **WebSockets:** Socket.io for authoritative state broadcasting.
- **Data Store:** In-memory (for MVP match state) + JSON/File-based persistence (could scale to DB later).

**Services (Modular implementation within Server):**
1.  **AuthService:** Simple token-based session management.
2.  **MatchManager:** Handles matchmaking queues (`Casual`, `Ranked`) and room creation.
3.  **GameplayEngine:** The "Source of Truth". Validates moves, transitions game states (Lobby -> L1 -> L2 -> L3 -> L4 -> End).
4.  **AIOrchestrator:** Mock/Integration layer for AI APIs (OpenAI, Anthropic, etc.) to evaluate prompts.
5.  **ScoringEngine:** Calculates similarity scores and efficiency metrics.

## 4. Design & Aesthetics (The "Wow" Factor)

-   **Theme:** "Cyber-Competitive". Dark mode default. Neon accents (Cyan/Magenta).
-   **Typography:** 'Inter' or 'Orbitron' (Google Fonts).
-   **Visuals:** Glassmorphism panels, subtle scanlines, animated borders.
-   **Feedback:** Sound effects (optional hook), immediate visual feedback on interactions.

## 5. Development Phases

**Phase 1: Foundation (Current)**
- Setup monorepo structure.
- Initialize Server with Socket.io.
- Initialize Client with basic routing and CSS variables.

**Phase 2: Core Loop**
- Implement Lobby connection.
- Implement "Level 1" gameplay flow (Timer starts -> User types -> Submit -> Result).

**Phase 3: Visual Polish**
- Apply the "Esports" CSS.
- Add animations/transitions.

**Phase 4: Game Logic Expansion**
- Add Levels 2-4 constraints.
- Implement Scoring stub.

---
**Next Step:** Initialize project structure and foundational files.
