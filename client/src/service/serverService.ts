import { Client, Room } from "@colyseus/sdk";
import type { MyState } from "../../../server/src/rooms/schema/MyRoomState";
import axios from "axios";
import type { GameRoom } from "../types/Room";

class ServerConnection {
    client: Client;
    room?: Room<MyState>;
    apiClient: any;

    constructor() {
        this.client = new Client("http://localhost:2567");
        this.apiClient = axios.create({
            baseURL: 'http://localhost:2567',
        });
    }

    async connect(options?: any) {
        this.room = await this.client.create("my_room", options);
        return this.room;
    }

    async joinRoom(roomId: string, options?: any) {
        this.room = await this.client.joinById(roomId, options);
        return this.room;
    }

    async joinOrCreate(roomName: string, options?: any) {
        this.room = await this.client.joinOrCreate(roomName, options);
        return this.room;
    }

    async getAvailableRooms(): Promise<GameRoom[]> {
        const response = await this.apiClient.get(`/rooms/list`);
        console.log(response.data);
        return response.data as GameRoom[];
    }
}

export const serverConnection = new ServerConnection();

