import { Delayed, Clock } from "colyseus";
import { MyState } from "../rooms/schema/MyRoomState.js";
import { Client } from "colyseus";

export class GameLogic {
    private state: MyState;
    private clock: Clock;
    private broadcast: (type: string | number, message?: any) => void;

    private readyPlayers: Set<string> = new Set();

    constructor(state: MyState, clock: Clock, broadcast: (type: string | number, message?: any) => void) {
        this.state = state;
        this.clock = clock;
        this.broadcast = broadcast;
        this.startShuffleTimer();
    }

    public setPlayerReady(sessionId: string) {
        this.readyPlayers.add(sessionId);
        console.log(`Player ${sessionId} marked as ready.`);
    }

    private startShuffleTimer() {
        this.clock.setInterval(() => {
            if (this.state.gameState !== "COLLECTION") return;

            // Only start counting down when all current players have joined the ready set
            const allReady = this.state.players.size > 0 &&
                Array.from(this.state.players.keys()).every(id => this.readyPlayers.has(id));

            if (!allReady) return;

            if (this.state.shuffleCountdown > 0) {
                this.state.shuffleCountdown--;
            } else {
                this.shuffleDeck();
            }
        }, 1000);
    }

    public handleCardSelection(client: Client, index: number) {
        const player = this.state.players.get(client.sessionId);

        if (!player || player.hasSelected || player.isSelecting) return;

        if (index !== undefined && index >= 0 && index < this.state.deckToView.length) {
            const cardToRemove = this.state.deckToView[index];

            if (cardToRemove.isRemoved) return;

            // Block auto-selection for this player
            player.isSelecting = true;

            // Broadcast that this card is about to be removed so ALL clients play animation
            this.broadcast("cardRemoving", { cardId: cardToRemove.id, index, selectorId: client.sessionId });

            // Wait for animation (600ms) before actual state change
            this.clock.setTimeout(() => {
                player.isSelecting = false;

                // Re-check just in case something changed (e.g. game already ended)
                if (this.state.gameState !== "COLLECTION") return;

                // Instead of removing from view array (which shifts indices), we mark it as removed
                cardToRemove.isRemoved = true;

                // Add to player's personal deck
                const playerDeck = this.state.playerDecks.get(client.sessionId);
                if (playerDeck) {
                    playerDeck.cards.push(cardToRemove);
                }

                // Mark player as having selected for this shuffle
                player.hasSelected = true;

                // Still remove from mainDeck too
                const mainDeckIndex = this.state.mainDeck.cards.indexOf(cardToRemove);
                if (mainDeckIndex !== -1) {
                    this.state.mainDeck.cards.splice(mainDeckIndex, 1);
                }
                console.log(`Card "${cardToRemove.name}" added to player ${client.sessionId}'s deck.`);

                // Removed: Immediate transition. We wait for the round to end.
            }, 600);
        }
    }

    private checkDuelTransition() {
        let allPlayersReady = true;

        // Ensure every player in the session has at least 5 cards
        if (this.state.players.size === 0) return false;

        this.state.players.forEach((_, sessionId) => {
            const playerDeck = this.state.playerDecks.get(sessionId);
            if (!playerDeck || playerDeck.cards.length < 5) {
                allPlayersReady = false;
            }
        });

        if (allPlayersReady && this.state.gameState === "COLLECTION") {
            this.state.gameState = "DUEL_COUNTDOWN";
            this.broadcast("gameStateChanged", { state: "DUEL_COUNTDOWN" });
            console.log("Starting DUEL countdown...");

            this.clock.setTimeout(() => {
                this.state.gameState = "DUEL";
                this.broadcast("gameStateChanged", { state: "DUEL" });
                console.log("Duel Phase Started!");
            }, 5000);
        }
        return allPlayersReady;
    }

    public populateInitialDeck() {
        console.log("Populating initial deck for collection...");
        this.state.mainDeck.cards.shuffle();
        this.state.deckToView.clear();
        this.state.deckToView.push(...this.state.mainDeck.cards.slice(0, 5));
        this.state.shuffleCountdown = 5;
    }

    public shuffleDeck() {
        if (this.state.gameState !== "COLLECTION") return;

        // Reset countdown
        this.state.shuffleCountdown = 5;

        // 1. Auto-selection for players who didn't pick and aren't currently selecting
        this.state.players.forEach((player, sessionId) => {
            if (!player.hasSelected && !player.isSelecting) {
                // Find a card that isn't already removed by someone else in the current view
                const availableCard = this.state.deckToView.find(c => !c.isRemoved);
                if (availableCard) {
                    availableCard.isRemoved = true;
                    const playerDeck = this.state.playerDecks.get(sessionId);
                    if (playerDeck) {
                        playerDeck.cards.push(availableCard);

                        // FIX: Also remove from mainDeck so it doesn't reappear
                        const mainDeckIndex = this.state.mainDeck.cards.indexOf(availableCard);
                        if (mainDeckIndex !== -1) {
                            this.state.mainDeck.cards.splice(mainDeckIndex, 1);
                        }
                    }
                    console.log(`Auto-selected "${availableCard.name}" for player ${sessionId}`);
                }
            }
        });

        // 2. Check for DUEL phase transition AFTER auto-selections
        if (this.checkDuelTransition()) {
            return; // Stop shuffling if we are dueling
        }

        // 3. Normal Shuffle Logic
        // Reset selection status for all players on shuffle
        this.state.players.forEach(player => {
            player.hasSelected = false;
            player.isSelecting = false; // Safety reset
        });

        this.state.mainDeck.cards.shuffle();

        // Update deckToView (clear and replace)
        this.state.deckToView.clear();
        this.state.deckToView.push(...this.state.mainDeck.cards.slice(0, 5));

        this.broadcast("deckShuffled", { message: "Deck shuffled" });
    }
}
