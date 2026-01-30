import { RetroCard } from './RetroCard';
import type { Player, Deck } from "../../../../server/src/rooms/schema/MyRoomState";
import { MapSchema } from "@colyseus/schema";
import { DuelBackground } from './DuelBackground';

interface DuelViewProps {
    playerDecks: MapSchema<Deck>;
    sessionId: string;
    players: MapSchema<Player>;
}

export const DuelView = ({ playerDecks, sessionId, players }: DuelViewProps) => {
    const opponentId = Array.from(players.keys()).find(id => id !== sessionId);

    const myCards = playerDecks.get(sessionId)?.cards || [];
    const opponentCards = opponentId ? (playerDecks.get(opponentId)?.cards || []) : [];

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-between py-12 pointer-events-none animate-fade-in">
            <DuelBackground />
            {/* Opponent Area (Top Edge) */}
            <div className="flex justify-center flex-wrap gap-4 pointer-events-auto">
                {opponentCards.map((card, idx) => (
                    <div key={`opp-${card.id}-${idx}`} className="scale-[0.8] opacity-90 transition-transform hover:translate-y-2">
                        <RetroCard
                            card={card}
                            index={idx}
                            isBeingRemoved={false}
                            isSelector={false}
                            onClick={() => { }}
                            forceShow={true}
                            isHidden={true}
                        />
                    </div>
                ))}
            </div>

            {/* Empty Battle Center */}
            <div className="flex-1 flex items-center justify-center p-8">
                {/* Space reserved for future combat effects/texts */}
            </div>

            {/* Player Area (Bottom Edge) */}
            <div className="flex justify-center flex-wrap gap-4 pointer-events-auto">
                {myCards.map((card, idx) => (
                    <div key={`my-${card.id}-${idx}`} className="scale-[0.85] hover:translate-y-[-5px] transition-transform">
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
