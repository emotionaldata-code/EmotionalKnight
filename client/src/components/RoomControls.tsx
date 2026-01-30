import { useState, useEffect } from "react";
import { useServerConnection } from "../context/ServerConnectionContext";
import { useUser } from "../context/UserContext";

export const RoomControls = () => {
    const { isConnected, room, joinRoom, createRoom, leaveRoom } = useServerConnection();
    const { username } = useUser();
    const [roomIdInput, setRoomIdInput] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [playerCount, setPlayerCount] = useState(room?.state?.players?.size || 0);

    useEffect(() => {
        if (!room) return;
        const listener = room.onStateChange((state) => {
            setPlayerCount(state.players.size);
        });
        return () => listener.clear();
    }, [room]);

    const handleCreate = () => {
        createRoom({ name: username });
    };

    const handleJoin = () => {
        if (roomIdInput) {
            joinRoom(roomIdInput, { name: username });
        }
    };

    const handleCopy = () => {
        if (room) {
            navigator.clipboard.writeText(room.roomId);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    const handleStart = () => {
        if (room) {
            room.send("startGame");
        }
    };

    if (isConnected && room) {
        const isFull = playerCount >= 2;

        return (
            <div className="w-full p-4 border-2 border-retro-green bg-retro-dark relative overflow-hidden flex flex-col">
                {showToast && (
                    <div className="absolute top-0 right-0 z-10 bg-retro-green text-black px-4 py-2 font-bold animate-pulse border-2 border-white">
                        COPIED
                    </div>
                )}
                <div className="flex justify-between items-center border-b-2 border-retro-green pb-2 mb-4">
                    <h2 className="text-lg">
                        STATUS: <span className="text-retro-green animate-pulse">CONNECTED</span>
                    </h2>
                    <div className="text-sm font-mono opacity-70 uppercase">
                        Players: <span className={isFull ? "text-retro-green" : "text-red-500"}>{playerCount}/2</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 bg-black p-3 border border-retro-green/30">
                        <div className="flex justify-between items-center">
                            <span className="font-mono text-xs opacity-50 uppercase">Room ID</span>
                            <div className="flex items-center gap-2">
                                <code className="bg-retro-green text-black px-2 py-0.5 font-bold text-lg">{room.roomId}</code>
                                <button
                                    onClick={handleCopy}
                                    className="text-[10px] bg-transparent border border-retro-green text-retro-green px-2 py-0.5 hover:bg-retro-green hover:text-black transition-colors uppercase"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                        <button
                            className="w-full py-1 bg-red-900/40 text-red-500 font-bold hover:bg-red-600 hover:text-white border border-red-800 uppercase text-[10px] transition-all"
                            onClick={leaveRoom}
                        >
                            Disconnect
                        </button>
                    </div>

                    <div className="p-4 border-2 border-dashed border-retro-green/30 bg-black/40 flex flex-col items-center gap-3">
                        <div className="text-center font-mono text-[10px] opacity-60 uppercase tracking-widest">
                            {isFull ? "Protocol Ready" : "Awaiting Second Pilot..."}
                        </div>
                        <button
                            onClick={handleStart}
                            disabled={!isFull}
                            className={`w-full py-3 text-lg font-bold uppercase transition-all border-4 ${isFull
                                ? "bg-retro-green text-black border-white hover:bg-white animate-pulse"
                                : "bg-black text-retro-green/30 border-retro-green/30 cursor-not-allowed"
                                }`}
                        >
                            {isFull ? "Start Game" : "Waiting..."}
                        </button>

                        {/* Hidden Debug Shortcut */}
                        <button
                            onClick={() => room.send("debug_skipToDuel")}
                            className="mt-2 text-[8px] opacity-10 hover:opacity-50 text-retro-green uppercase font-mono tracking-tighter"
                        >
                            [Dev] Force Duel Phase
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex-1 p-8 border-2 border-retro-green bg-retro-dark shadow-[4px_4px_0_0_rgba(74,222,128,0.3)] flex flex-col justify-center items-center gap-8">
            <h2 className="text-3xl text-center text-shadow-glow uppercase tracking-[0.2em] border-b-2 border-retro-green pb-2 w-full max-w-sm">Join Protocol</h2>

            <div className="flex flex-col gap-6 w-full max-w-sm">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="ENTER_ROOM_ID..."
                        value={roomIdInput}
                        onChange={(e) => setRoomIdInput(e.target.value)}
                        className="flex-1 p-3 bg-black border-2 border-retro-green text-retro-green font-mono focus:outline-none focus:shadow-[0_0_8px_#4ade80] placeholder:opacity-30"
                    />
                    <button
                        onClick={handleJoin}
                        disabled={!roomIdInput}
                        className="px-6 py-3 bg-retro-green text-black font-bold uppercase hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Join
                    </button>
                </div>

                <div className="flex items-center gap-4 my-2 opacity-50">
                    <div className="h-0.5 w-full bg-retro-green/30"></div>
                    <span className="uppercase text-xs font-mono">Or</span>
                    <div className="h-0.5 w-full bg-retro-green/30"></div>
                </div>

                <button
                    className="w-full py-4 border-2 border-retro-green text-retro-green hover:bg-retro-green hover:text-black font-bold uppercase transition-colors shadow-[0_0_15px_rgba(74,222,128,0.1)]"
                    onClick={handleCreate}
                >
                    Initialize New Room
                </button>
            </div>
        </div>
    );
};
