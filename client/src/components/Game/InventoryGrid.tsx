import { RetroCard } from './RetroCard';
import type { Card } from "../../../../server/src/rooms/schema/MyRoomState";

interface InventoryGridProps {
    hand: Card[];
    pendingRemoval: { id: string, selectorId: string } | null;
    sessionId: string;
    onCardClick: (index: number) => void;
    hasAlreadySelected: boolean;
}

export const InventoryGrid = ({
    hand,
    pendingRemoval,
    sessionId,
    onCardClick,
    hasAlreadySelected
}: InventoryGridProps) => {
    return (
        <div className={`flex justify-center gap-6 flex-wrap transition-opacity duration-500 ${hasAlreadySelected ? 'opacity-40 grayscale-[0.5] pointer-events-none' : 'opacity-100'}`}>
            {hand.length > 0 ? (
                hand.map((card, index) => (
                    <RetroCard
                        key={card.id}
                        card={card}
                        index={index}
                        isBeingRemoved={card.id === pendingRemoval?.id}
                        isSelector={pendingRemoval?.selectorId === sessionId}
                        onClick={() => onCardClick(index)}
                    />
                ))
            ) : (
                <p className="text-xl opacity-50 animate-pulse font-mono tracking-widest">{">>"} INVENTORY EMPTY {"<<"}</p>
            )}
        </div>
    );
};
