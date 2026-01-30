export const DuelBackground = () => (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        {/* Base Grid */}
        <div className="absolute inset-0 bg-grid-green opacity-30" />

        {/* Moving Scan Line */}
        <div className="absolute w-full h-[2px] bg-retro-green/10 shadow-[0_0_15px_rgba(74,222,128,0.5)] animate-scan" />

        {/* Center Target/Radar (Decorative) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-retro-green/10 rounded-full flex items-center justify-center">
            <div className="w-[300px] h-[300px] border border-retro-green/5 rounded-full" />
            <div className="w-[200px] h-[200px] border border-retro-green/5 rounded-full" />
            {/* Crosshair */}
            <div className="absolute w-full h-[1px] bg-retro-green/5" />
            <div className="absolute h-full w-[1px] bg-retro-green/5" />
        </div>

        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-vignette" />
    </div>
);
