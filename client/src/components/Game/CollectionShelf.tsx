import { RetroCard } from './RetroCard';
import type { Card } from "../../../../server/src/rooms/schema/MyRoomState";

interface CollectionShelfProps {
    cards: Card[];
    sessionId: string;
}

export const CollectionShelf = ({ cards }: CollectionShelfProps) => {
    return (
        <div className="mt-12 w-full max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-retro-green/30 to-retro-green/10"></div>
                <h3 className="text-xl font-mono text-retro-green tracking-[0.3em] uppercase flex items-center gap-3">
                    <span className="text-sm opacity-50">SYS.</span>COLLECTION
                </h3>
                <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-retro-green/30 to-retro-green/10"></div>
            </div>

            <div className="flex justify-center flex-wrap gap-4 min-h-[140px] p-6 border border-retro-green/10 bg-retro-green/[0.02] relative">
                {/* Decorative scanner line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-retro-green/10 animate-[scan_4s_linear_infinite]"></div>

                {cards.length > 0 ? (
                    cards.map((card, idx) => (
                        <RetroCard
                            key={`${card.id}-${idx}`}
                            card={card}
                            index={idx}
                            isBeingRemoved={false}
                            isSelector={true}
                            onClick={() => { }}
                            size="small"
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center opacity-20 py-8">
                        <span className="text-sm font-mono tracking-widest uppercase mb-2 text-retro-green">Shelf_Empty</span>
                        <div className="w-48 h-[1px] bg-retro-green"></div>
                    </div>
                )}
            </div>
        </div>
    );
};
