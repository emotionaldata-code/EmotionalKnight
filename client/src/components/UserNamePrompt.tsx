import { useState } from "react";
import { useUser } from "../context/UserContext";

export const UserNamePrompt = () => {
    const { setUsername } = useUser();
    const [inputName, setInputName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputName.trim()) {
            setUsername(inputName.trim());
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 border-2 border-retro-green bg-retro-bg shadow-[4px_4px_0px_0px_rgba(74,222,128,0.5)]">
                <h2 className="text-4xl mb-4 text-center uppercase tracking-widest text-shadow-glow">Welcome, Knight</h2>
                <p className="text-xl mb-8 text-center opacity-80">{">"} Enter your name to begin...</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <input
                        type="text"
                        placeholder="Name..."
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        className="w-full p-4 bg-black border-2 border-retro-green text-retro-green text-2xl focus:outline-none focus:shadow-[0_0_10px_#4ade80] placeholder-green-900"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!inputName.trim()}
                        className="w-full p-4 bg-retro-green text-black text-2xl font-bold uppercase hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        [ Enter World ]
                    </button>
                </form>
            </div>
        </div>
    );
};
