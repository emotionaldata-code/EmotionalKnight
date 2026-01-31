import { RetroCard } from './RetroCard';
import type { Player, Deck } from "../../../../server/src/rooms/schema/MyRoomState";
import { MapSchema } from "@colyseus/schema";
import { DuelBackground } from './DuelBackground';

interface DuelViewProps {
    playerDecks: MapSchema<Deck>;
    sessionId: string;
    players: MapSchema<Player>;
    duelCountdown: number;
    duelRound: number;
    isRevealPhase: boolean;
    onCardClick: (cardId: string) => void;
}

export const DuelView = ({ playerDecks, sessionId, players, duelCountdown, duelRound, isRevealPhase, onCardClick }: DuelViewProps) => {
    const opponentId = Array.from(players.keys()).find(id => id !== sessionId);
    const me = players.get(sessionId);
    const opponent = opponentId ? players.get(opponentId) : null;

    const myCards = playerDecks.get(sessionId)?.cards || [];
    const opponentCards = opponentId ? (playerDecks.get(opponentId)?.cards || []) : [];

    const mySelectedCard = (playerDecks.get(sessionId)?.cards || []).find(c => me?.selectedCardId === c.id);
    const opponentSelectedCard = opponentId ? (playerDecks.get(opponentId)?.cards || []).find(c => opponent?.selectedCardId === c.id) : null;

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-between py-8 pointer-events-none animate-fade-in">
            <DuelBackground />

            {/* Duel Info Header */}
            <div className="z-10 flex flex-col items-center gap-2 pointer-events-auto">
                <div className="text-retro-green font-mono text-sm uppercase tracking-[0.3em] opacity-70">
                    Duel Protocol - Round {duelRound}/5
                </div>
                <div className={`text-5xl font-mono ${duelCountdown <= 2 ? 'text-red-500 animate-pulse' : 'text-retro-green'} border-4 ${duelCountdown <= 2 ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'border-retro-green shadow-[0_0_20px_rgba(74,222,128,0.3)]'} px-8 py-2 min-w-[120px] text-center bg-black`}>
                    {duelCountdown}s
                </div>
            </div>

            {/* Opponent Area (Top Edge) */}
            <div className="flex justify-center flex-wrap gap-4 pointer-events-auto">
                {opponentCards.map((card, idx) => (
                    <div
                        key={`opp-${card.id}-${idx}`}
                        className={`scale-[0.8] transition-all duration-500 ${opponent?.selectedCardId === card.id
                            ? 'opacity-20 translate-y-[-10px]'
                            : 'opacity-90'
                            }`}
                    >
                        <RetroCard
                            card={card}
                            index={idx}
                            isBeingRemoved={false}
                            isSelector={false}
                            onClick={() => { }}
                            forceShow={false}
                            isHidden={true}
                        />
                    </div>
                ))}
            </div>

            {/* Battle Center */}
            <div className="flex-1 flex flex-row items-center justify-center gap-12 p-8 z-20">
                {/* My Selected Card */}
                {me?.hasSelected && (
                    <div className={`transition-all duration-700 ${isRevealPhase ? 'scale-110' : 'scale-90 opacity-80 translate-y-8'}`}>
                        {mySelectedCard && (
                            <RetroCard
                                card={mySelectedCard}
                                index={0}
                                isBeingRemoved={false}
                                isSelector={true}
                                onClick={() => { }}
                                forceShow={true}
                                isHidden={false}
                            />
                        )}
                        <div className="text-center text-[10px] text-retro-green bg-black/80 mt-2 px-2 uppercase font-mono">
                            Your Choice
                        </div>
                    </div>
                )}

                <div className="text-4xl font-bold text-retro-green opacity-20 italic">VS</div>

                {/* Opponent Selected Card */}
                {opponent?.hasSelected && (
                    <div className={`transition-all duration-700 ${isRevealPhase ? 'scale-110' : 'scale-90 opacity-80 -translate-y-8'}`}>
                        {opponentSelectedCard && (
                            <RetroCard
                                card={opponentSelectedCard}
                                index={0}
                                isBeingRemoved={false}
                                isSelector={false}
                                onClick={() => { }}
                                forceShow={isRevealPhase}
                                isHidden={!isRevealPhase}
                            />
                        )}
                        <div className="text-center text-[10px] text-retro-green bg-black/80 mt-2 px-2 uppercase font-mono">
                            {isRevealPhase ? "Opponent" : "Selected..."}
                        </div>
                    </div>
                )}
            </div>

            {/* Player Area (Bottom Edge) */}
            <div className="flex justify-center flex-wrap gap-4 pointer-events-auto">
                {myCards.map((card, idx) => (
                    <div
                        key={`my-${card.id}-${idx}`}
                        className={`scale-[0.85] transition-all duration-300 pointer-events-auto ${me?.selectedCardId === card.id
                            ? 'opacity-20 translate-y-[10px]'
                            : 'hover:translate-y-[-10px] cursor-pointer'
                            }`}
                        onClick={() => !me?.hasSelected && onCardClick(card.id)}
                    >
                        <RetroCard
                            card={card}
                            index={idx}
                            isBeingRemoved={false}
                            isSelector={true}
                            onClick={() => { }}
                            forceShow={true}
                            isHidden={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
