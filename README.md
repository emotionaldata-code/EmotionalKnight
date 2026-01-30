# Emotional Knight

Emotional Knight is a fast-paced multiplayer retro card game built with **Colyseus** and **React**. Players progress through a high-stakes collection phase before facing off in a strategic duel.

## 🎮 Game Overview

The game follows a distinct phase-based flow:
1.  **Lobby**: Players join a room. Once two players are connected, the game can be initialized.
2.  **Collection Phase**: A shared pool of cards is presented. Players have 5 seconds to select a card for their deck. If no selection is made, the system auto-assigns a card. This repeats until each player has 5 cards.
3.  **Duel Phase**: Players enter a tactical battleground where their collected decks are put to the test.

## 🏗️ Technical Architecture

The project is split into two main modules, leveraging real-time state synchronization for a seamless multiplayer experience.

### 🌓 Server-Side (Colyseus)
- **Game Engine (`GameLogic.ts`)**: Manages the core loop, including shuffle timers, card selection rules, and phase transitions.
- **Room Management (`MyRoom.ts`)**: Handles client lifecycle, message routing, and room-specific configurations.
- **State Schema (`MyRoomState.ts`)**: Uses Colyseus Schema to define the synchronized data structure (Players, Decks, Game States), ensuring low-latency updates to all clients.

### 🌓 Client-Side (React)
- **Real-time Sync (`ServerConnectionContext.tsx`)**: Connects the UI to the Colyseus server, reacting to state changes and incoming messages.
- **Dynamic Views**: The UI switches between `InventoryGrid`, `CollectionShelf`, and `DuelView` based on the synchronized `gameState`.
- **Retro Aesthetic**: Uses custom SVG filters (`RetroFilters.tsx`) and CSS animations to achieve a CRT-inspired "glitch" look.

## 🛠️ Technology Stack

- **Frontend**: 
  - **React 19** with **Vite** for optimized development.
  - **Tailwind CSS 4** for modern, utility-first styling.
  - **Colyseus SDK** for real-time multiplayer coordination.
- **Backend**: 
  - **Node.js** with **TypeScript**.
  - **Colyseus Server** for authoritative state management.
  - **Express** for hosting the server environment.

## 🚀 Getting Started

To run the project locally, you will need two terminal windows.

### 1. Start the Server
```bash
cd server
npm install
npm run start
```
The server will run on `http://localhost:2567`.

### 2. Start the Client
```bash
cd client
npm install
npm run dev
```
The client will be available at `http://localhost:5173`.

### 💡 Development Tips
- **Testing**: Run `npm test` in the `server` directory to execute mocha tests.
- **Multiplayer Testing**: Open two different browser tabs to join the same room and test the interaction.
- **Dev Tools**: Use the hidden debug button in the room lobby to skip directly to the Duel phase during testing.
