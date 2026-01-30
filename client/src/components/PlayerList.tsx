import { useEffect, useState } from "react";
import { useRoom } from "../context/ServerConnectionContext";
import { Player } from "../../../server/src/rooms/schema/MyRoomState.js";
import { PlayerStatsCard } from "./Game/PlayerStatsCard";

export const PlayerList = () => {
    const room = useRoom();
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        if (!room) return;

        const updatePlayers = () => {
            setPlayers(Array.from(room.state.players.values()));
        };

        updatePlayers();

        const onStateChange = room.onStateChange(() => {
            updatePlayers();
        });

        return () => {
            onStateChange.clear();
        };
    }, [room]);

    if (!room) return null;

    return (
        <div className="w-full h-full flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 overflow-hidden">
                <h3 className="text-sm mb-4 text-retro-green uppercase font-mono tracking-widest flex items-center gap-2 border-b border-retro-green/20 pb-1">
                    <span className="opacity-50">Lobby</span>
                    <span className="bg-retro-green text-black px-1.5 text-[10px]">{players.length}</span>
                </h3>

                <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[calc(100%-40px)] pr-2 scrollbar-thin">
                    {players.length > 0 ? (
                        players.map((player: Player) => {
                            const sessionId = Array.from(room.state.players.entries()).find(([, p]) => p === player)?.[0];
                            const playerDeck = sessionId ? room.state.playerDecks.get(sessionId) : undefined;

                            return (
                                <div key={player.name} className="scale-90 origin-top">
                                    <PlayerStatsCard
                                        player={player}
                                        sessionId={sessionId}
                                        isLocal={sessionId === room.sessionId}
                                        playerDeck={playerDeck}
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center opacity-30 py-4 italic text-[10px] font-mono animate-pulse">Scanning...</p>
                    )}
                </div>
            </div>
        </div>
    );
};
