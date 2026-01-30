import { useState, useEffect } from "react";
import { Room } from "@colyseus/sdk";
import { Card, MyState } from "../../../server/src/rooms/schema/MyRoomState";

export const useGameState = (room: Room<MyState>) => {
    const [hand, setHand] = useState<Card[]>([]);
    const [pendingRemoval, setPendingRemoval] = useState<{ id: string, selectorId: string } | null>(null);
    const [gameState, setGameState] = useState<string>(room.state.gameState);
    const [shuffleCountdown, setShuffleCountdown] = useState<number>(room.state.shuffleCountdown);

    useEffect(() => {
        const updateHand = () => {
            setHand([...room.state.deckToView]);
        };

        // Initial set
        if (room.state.deckToView.length > 0) {
            updateHand();
        }

        const messageListener = room.onMessage("deckShuffled", () => {
            updateHand();
        });

        const removalListener = room.onMessage("cardRemoving", (message) => {
            setPendingRemoval({ id: message.cardId, selectorId: message.selectorId });
        });

        const stateListener = room.onStateChange(() => {
            setHand([...room.state.deckToView]);
            setGameState(room.state.gameState);
            setShuffleCountdown(room.state.shuffleCountdown);
            // Clear pending removal if it's no longer in the state
            setPendingRemoval(prev => {
                if (!prev) return null;
                const stillExists = room.state.deckToView.some(c => c.id === prev.id);
                return stillExists ? prev : null;
            });
        });

        return () => {
            messageListener();
            removalListener();
            stateListener.clear();
        }
    }, [room]);

    const handleCardClick = (index: number) => {
        const card = hand[index];
        if (!card || card.isRemoved) return;

        const me = room.state.players.get(room.sessionId);

        // Don't allow clicking if I already selected or am currently in an animation
        if (me?.hasSelected || pendingRemoval?.selectorId === room.sessionId) return;

        // Don't allow clicking a card that someone else is already picking
        if (pendingRemoval?.id === card.id) return;

        room.send("selectCard", { index });
    };

    return {
        hand,
        pendingRemoval,
        handleCardClick,
        gameState,
        shuffleCountdown,
        me: room.state.players.get(room.sessionId),
        playerDecks: room.state.playerDecks
    };
};
