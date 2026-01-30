import { useEffect, useState } from "react";

interface CountdownViewProps {
    onComplete: () => void;
}

export const CountdownView = ({ onComplete }: CountdownViewProps) => {
    const [count, setCount] = useState(5);

    useEffect(() => {
        if (count <= 0) {
            onComplete();
            return;
        }

        const timer = setTimeout(() => {
            setCount(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [count, onComplete]);

    return (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center animate-fade-in">
            <h2 className="text-3xl uppercase tracking-widest text-retro-green mb-8 animate-pulse text-center">
                Preparing Battle...
            </h2>

            <div className="relative flex items-center justify-center w-64 h-64 border-4 border-retro-green bg-black shadow-[0_0_30px_rgba(74,222,128,0.2)]">
                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-4 h-4 bg-retro-green"></div>
                <div className="absolute top-0 right-0 w-4 h-4 bg-retro-green"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 bg-retro-green"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-retro-green"></div>

                <div className="text-9xl font-bold text-retro-green text-shadow-glow">
                    {count}
                </div>
            </div>

            <div className="mt-8 text-sm font-mono opacity-70 blinking-cursor">
                {">>"} SYNCHRONIZING NEURAL LINK...
            </div>
        </div>
    );
};
