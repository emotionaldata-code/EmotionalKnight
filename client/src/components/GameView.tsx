import { useRoom } from "../context/ServerConnectionContext";
import { useGameState } from "../hooks/useGameState";
import { InventoryGrid } from "./Game/InventoryGrid";
import { CollectionShelf } from "./Game/CollectionShelf";
import { RetroFilters } from "./Common/RetroFilters";
import { DuelView } from "./Game/DuelView";
import { CountdownView } from "./CountdownView";

export const GameView = () => {
    const room = useRoom();
    if (!room) return null;

    const {
        hand,
        pendingRemoval,
        handleCardClick,
        me,
        playerDecks,
        gameState,
        shuffleCountdown,
        duelCountdown,
        duelRound,
        isRevealPhase,
        handleDuelCardClick
    } = useGameState(room);

    const hasAlreadySelected = me?.hasSelected || (pendingRemoval?.selectorId === room.sessionId);

    return (
        <div className="w-full flex flex-col items-center gap-8 animate-fade-in pb-12">
            <RetroFilters />

            {gameState === "DUEL" ? (
                <DuelView
                    playerDecks={playerDecks}
                    sessionId={room.sessionId}
                    players={room.state.players}
                    duelCountdown={duelCountdown}
                    duelRound={duelRound}
                    isRevealPhase={isRevealPhase}
                    onCardClick={handleDuelCardClick}
                />
            ) : gameState === "GAME_OVER" ? (
                <div className="flex flex-col items-center justify-center py-20 gap-8 animate-fade-in">
                    <h2 className="text-6xl text-retro-green uppercase tracking-widest text-shadow-glow">Game Over</h2>
                    <div className="text-xl font-mono opacity-50 uppercase tracking-widest">Protocol Terminated</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-8 py-4 border-2 border-retro-green text-retro-green hover:bg-retro-green hover:text-black font-bold uppercase transition-all"
                    >
                        Restart Simulation
                    </button>
                </div>
            ) : gameState === "DUEL_COUNTDOWN" ? (
                <CountdownView onComplete={() => { }} />
            ) : (
                <>
                    <h1 className="text-4xl md:text-6xl mb-12 text-center uppercase tracking-[0.2em] text-shadow-glow border-b-4 border-retro-green pb-4 w-full max-w-4xl">
                        Emotional Knight
                    </h1>

                    <div className="w-full max-w-4xl flex items-center justify-center gap-8 relative">
                        <h2 className="text-3xl uppercase tracking-widest border-b-4 border-retro-green pb-2 text-center">Your Inventory</h2>
                        <div className="flex flex-col items-center">
                            <div className="text-xs font-mono text-retro-green opacity-50 uppercase tracking-tighter -mb-1">Reset In</div>
                            <div className={`text-4xl font-mono ${shuffleCountdown <= 2 ? 'text-red-500 animate-pulse' : 'text-retro-green'} border-2 ${shuffleCountdown <= 2 ? 'border-red-500' : 'border-retro-green'} px-4 py-1 min-w-[80px] text-center bg-black shadow-[0_0_15px_rgba(74,222,128,0.1)]`}>
                                {shuffleCountdown}s
                            </div>
                        </div>
                    </div>

                    <InventoryGrid
                        hand={hand}
                        pendingRemoval={pendingRemoval}
                        sessionId={room.sessionId}
                        onCardClick={handleCardClick}
                        hasAlreadySelected={hasAlreadySelected}
                    />

                    <CollectionShelf
                        cards={playerDecks.get(room.sessionId)?.cards || []}
                        sessionId={room.sessionId}
                    />
                </>
            )}
        </div>
    );
};
