import { MyState, Card, Deck, Player } from "../rooms/schema/MyRoomState.js";

export class TestUtils {
    public static skipToDuel(state: MyState) {
        if (state.players.size < 1) {
            console.warn("[TestUtils] Cannot skip to duel: No players in room.");
            return;
        }

        console.log("[TestUtils] Triggering SKIP TO DUEL...");

        // 1. Populate player decks if they don't have cards
        state.players.forEach((player: Player, sessionId: string) => {
            let deck = state.playerDecks.get(sessionId);

            // If the player doesn't have a deck, create one
            if (!deck) {
                deck = new Deck();
                state.playerDecks.set(sessionId, deck);
            }

            // If the deck is empty, give them some cards
            if (deck.cards.length < 4) {
                console.log(`[TestUtils] Populating dummy deck for player: ${player.name} (${sessionId})`);

                const dummyNames = [
                    "Debug Blade",
                    "Debug Shield",
                    "Debug Potion",
                    "Debug Spark",
                ];

                dummyNames.forEach(name => {
                    deck!.cards.push(new Card(name));
                });
            }
        });

        // 2. Transition State
        state.gameState = "DUEL";
        console.log("[TestUtils] State transitioned to DUEL.");
    }
}
