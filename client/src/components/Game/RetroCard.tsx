import type { Card } from "../../../../server/src/rooms/schema/MyRoomState";

interface RetroCardProps {
    card: Card;
    index: number;
    isBeingRemoved: boolean;
    isSelector: boolean;
    onClick: () => void;
    size?: 'normal' | 'small';
    forceShow?: boolean;
    isHidden?: boolean;
}

export const RetroCard = ({
    card,
    index,
    isBeingRemoved,
    isSelector,
    onClick,
    size = 'normal',
    forceShow = false,
    isHidden = false
}: RetroCardProps) => {
    const animationClass = isBeingRemoved
        ? (isSelector ? 'animate-retro-absorption' : 'animate-retro-dispersion')
        : 'animate-retro-resolve';

    const sizeClasses = size === 'normal' ? 'w-32 h-48' : 'w-24 h-32';
    const textClasses = size === 'normal' ? 'font-bold text-lg' : 'font-bold text-[10px]';
    const borderColor = isHidden ? 'border-red-500/50' : 'border-retro-green';
    const textColor = isHidden ? 'text-red-500' : 'text-retro-green';

    if (card.isRemoved && size === 'normal' && !forceShow) {
        return (
            <div className={`${sizeClasses} empty-slot relative flex items-center justify-center`}>
                <span className="text-retro-green opacity-20 font-mono text-[10px] uppercase text-center p-2">Slot Empty</span>
            </div>
        );
    }

    return (
        <div
            className={`${sizeClasses} bg-black border-2 ${borderColor} relative group cursor-pointer hover:-translate-y-2 transition-transform duration-200 shadow-[0_0_15px_rgba(74,222,128,0.2)] ${animationClass} overflow-hidden`}
            style={{
                animationDelay: isBeingRemoved ? '0ms' : `${index * 150}ms`,
                animationFillMode: 'forwards',
                opacity: isBeingRemoved ? 1 : 0
            }}
            onClick={onClick}
        >
            {/* Card Glow Effect */}
            <div className={`absolute inset-0 ${isHidden ? 'bg-red-500' : 'bg-retro-green'} opacity-0 group-hover:opacity-10 transition-opacity`}></div>

            {/* Corner Accents */}
            <div className={`absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 ${borderColor}`}></div>
            <div className={`absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 ${borderColor}`}></div>

            <div className="h-full flex flex-col items-center justify-center p-2 text-center relative z-10">
                {isHidden ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className={`w-12 h-16 border border-dashed ${borderColor} opacity-30 flex items-center justify-center`}>
                            <div className={`w-8 h-10 border border-dotted ${borderColor} opacity-20`}></div>
                        </div>
                        <span className={`text-[8px] font-mono uppercase tracking-[0.3em] ${textColor} opacity-50`}>
                            REDACTED
                        </span>
                    </div>
                ) : (
                    <>
                        <span className={`${textClasses} leading-tight group-hover:text-shadow-glow transition-all ${textColor}`}>
                            {card.name}
                        </span>
                        <div className={`mt-2 text-[8px] opacity-50 font-mono uppercase tracking-widest ${textColor}`}>
                            {size === 'normal' ? '[ITEM]' : 'ACQUIRED'}
                        </div>
                    </>
                )}
            </div>

            {/* Holographic glitch effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
                <div className={`${isHidden ? 'bg-red-500/10' : 'bg-retro-green/10'} mix-blend-overlay inset-0 absolute`}></div>
            </div>
        </div>
    );
};
