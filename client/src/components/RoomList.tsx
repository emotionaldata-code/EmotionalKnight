import { useServerConnection } from "../context/ServerConnectionContext";
import { useUser } from "../context/UserContext";

export const RoomList = () => {
    const { availableRooms, joinRoom, refreshAvailableRooms, setShowRoomList } = useServerConnection();
    const { username } = useUser();

    const handleJoin = (roomId: string) => {
        joinRoom(roomId, { name: username });
        setShowRoomList(false);
    };

    return (
        <div className="w-full h-full flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center border-b border-retro-green/20 pb-1 mb-4">
                    <h3 className="text-sm text-retro-green uppercase font-mono tracking-widest flex items-center gap-2">
                        <span className="opacity-50">Available Rooms</span>
                        <span className="bg-retro-green text-black px-1.5 text-[10px]">{availableRooms.length}</span>
                    </h3>
                    <button
                        onClick={() => refreshAvailableRooms()}
                        className="text-[10px] uppercase font-mono text-retro-green hover:underline"
                    >
                        Refresh
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin flex flex-col gap-3">
                    {availableRooms.length > 0 ? (
                        availableRooms.map((room) => (
                            <div
                                key={room.roomId}
                                className="border border-retro-green/30 bg-black/40 p-3 flex flex-col gap-2 hover:border-retro-green/60 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-mono opacity-50 uppercase">Room ID</span>
                                        <code className="text-retro-green font-bold">{room.roomId}</code>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-mono opacity-50 uppercase">Players</span>
                                        <span className="text-sm font-bold text-retro-green">{room.clients}/2</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleJoin(room.roomId)}
                                    className="w-full py-1.5 bg-retro-green text-black font-bold uppercase text-xs hover:bg-white transition-colors"
                                >
                                    Join Room
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 opacity-30 italic text-[10px] font-mono animate-pulse gap-2">
                            <span>Scanning For Signals...</span>
                            <button
                                onClick={() => refreshAvailableRooms()}
                                className="mt-4 not-italic underline hover:text-white"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setShowRoomList(false)}
                    className="mt-4 w-full py-2 border border-retro-green/30 text-retro-green/50 hover:text-retro-green hover:border-retro-green uppercase text-[10px] font-mono transition-all"
                >
                    Back to Menu
                </button>
            </div>
        </div>
    );
};
