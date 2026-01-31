export interface GameRoom {
    clients: number;
    maxClients: number;
    locked: boolean;
    private: boolean;
    createdAt: string;
    unlisted: boolean;
    name: string;
    processId: string;
    roomId: string;
}
