import { Client, Room } from "@colyseus/sdk";
import type { MyState } from "../../../server/src/rooms/schema/MyRoomState";

class ServerConnection {
    client: Client;
    room?: Room<MyState>;

    constructor() {
        this.client = new Client("http://localhost:2567");
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
}

export const serverConnection = new ServerConnection();

