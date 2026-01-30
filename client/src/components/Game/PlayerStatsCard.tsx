import { Player, Card, Deck } from "../../../../server/src/rooms/schema/MyRoomState";

interface PlayerStatsCardProps {
    player: Player;
    sessionId: string | undefined;
    isLocal: boolean;
    playerDeck: Deck | undefined;
}

export const PlayerStatsCard = ({ player, sessionId, isLocal, playerDeck }: PlayerStatsCardProps) => {
    const collectedCards = playerDeck?.cards || [];

    return (
        <div className="p-4 border-2 border-retro-green bg-black hover:bg-retro-dark transition-all group relative overflow-hidden">
            {/* Glassmorphism background effect */}
            <div className="absolute inset-0 bg-retro-green opacity-5 group-hover:opacity-10 pointer-events-none"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <div className="font-bold text-2xl text-retro-green group-hover:text-white transition-colors flex items-center gap-2">
                        <span className="w-3 h-3 bg-retro-green animate-pulse rounded-full"></span>
                        {player.name || "Unknown"}
                        {isLocal && <span className="text-[10px] bg-retro-green text-black px-1 ml-2">YOU</span>}
                    </div>
                    <div className="text-[10px] font-mono opacity-50 uppercase tracking-tighter">
                        ID: {sessionId?.substring(0, 8)}... | X: {player.x} Y: {player.y}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-mono text-retro-green opacity-70 uppercase mb-1">Status</div>
                    <span className={`text-[10px] px-2 py-0.5 border border-retro-green ${player.hasSelected ? 'bg-retro-green text-black' : 'text-retro-green'}`}>
                        {player.hasSelected ? 'SELECTION_MADE' : 'IDLE'}
                    </span>
                </div>
            </div>

            <div className="relative z-10">
                <div className="text-xs font-mono text-retro-green opacity-50 uppercase mb-2 flex items-center gap-2">
                    <span>Collection</span>
                    <div className="flex-1 h-[1px] bg-retro-green opacity-20"></div>
                    <span>{collectedCards.length} Units</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {collectedCards.length > 0 ? (
                        collectedCards.map((card: Card, idx: number) => (
                            <div
                                key={`${card.id}-${idx}`}
                                className="px-2 py-1 bg-retro-green/10 border border-retro-green/30 text-[10px] text-retro-green font-mono animate-retro-resolve"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {card.name.toUpperCase()}
                            </div>
                        ))
                    ) : (
                        <span className="text-[10px] font-mono opacity-30 italic">{">> No artifacts recovered yet <<"}</span>
                    )}
                </div>
            </div>
        </div>
    );
};
