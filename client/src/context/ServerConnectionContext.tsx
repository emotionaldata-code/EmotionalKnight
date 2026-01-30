import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { Room } from "@colyseus/sdk";
import { serverConnection } from "../service/serverService";
import type { MyState } from "../../../server/src/rooms/schema/MyRoomState";

interface ServerConnectionContextType {
    room?: Room<MyState>;
    isConnected: boolean;
    isGameStarted: boolean;
    joinRoom: (roomId: string, options?: any) => Promise<void>;
    joinOrCreateRoom: (roomName: string, options?: any) => Promise<void>;
    createRoom: (options?: any) => Promise<void>;
    leaveRoom: () => Promise<void>;
}

const ServerConnectionContext = createContext<ServerConnectionContextType | undefined>(undefined);

export const ServerConnectionProvider = ({ children }: { children: ReactNode }) => {
    const [room, setRoom] = useState<Room<MyState> | undefined>(undefined);
    const [isConnected, setIsConnected] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);

    useEffect(() => {
        setIsConnected(!!room);

        if (room) {
            room.onMessage("gameStarted", () => {
                setIsGameStarted(true);
            });
            room.onMessage("deckShuffled", () => {
                console.log("Deck shuffled");
            });

        } else {
            setIsGameStarted(false);
        }
    }, [room]);

    const createRoom = async (options?: any) => {
        try {
            const newRoom = await serverConnection.connect(options);
            setRoom(newRoom as Room<MyState>);
        } catch (e) {
            console.error("Failed to create room:", e);
        }
    };

    const joinRoom = async (roomId: string, options?: any) => {
        try {
            const newRoom = await serverConnection.joinRoom(roomId, options);
            setRoom(newRoom as Room<MyState>);
        } catch (e) {
            console.error("Failed to join room:", e);
        }
    };

    const joinOrCreateRoom = async (roomName: string, options?: any) => {
        try {
            const newRoom = await serverConnection.joinOrCreate(roomName, options);
            setRoom(newRoom as Room<MyState>);
        } catch (e) {
            console.error("Failed to join or create room:", e);
        }
    };

    const leaveRoom = async () => {
        if (room) {
            await room.leave();
            setRoom(undefined);
        }
    };

    return (
        <ServerConnectionContext.Provider value={{ room, isConnected, isGameStarted, joinRoom, createRoom, joinOrCreateRoom, leaveRoom }}>
            {children}
        </ServerConnectionContext.Provider>
    );
};

export const useServerConnection = () => {
    const context = useContext(ServerConnectionContext);
    if (!context) {
        throw new Error("useServerConnection must be used within a ServerConnectionProvider");
    }
    return context;
};

export const useRoom = () => {
    const { room } = useServerConnection();
    return room;
};
