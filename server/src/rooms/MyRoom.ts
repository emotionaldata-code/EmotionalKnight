import { Room, Client, Clock } from "colyseus";
import { Deck, MyState, Player } from "./schema/MyRoomState.js";
import { GameLogic } from "../logic/GameLogic.js";

interface RoomOptions {
  name: string;
}

import { TestUtils } from "../utils/TestUtils.js";

export class MyRoom extends Room<{ state: MyState }> {
  maxClients = 2;
  private gameLogic: GameLogic;

  onCreate(options: any) {
    this.state = new MyState();
    this.gameLogic = new GameLogic(this.state, this.clock, this.broadcast.bind(this));

    this.onMessage("selectCard", (client, message) => {
      this.gameLogic.handleCardSelection(client, message.index);
    });

    this.onMessage("readyToCollect", (client) => {
      this.gameLogic.setPlayerReady(client.sessionId);
    });

    this.onMessage("duelSelectCard", (client, message) => {
      this.gameLogic.handleDuelCardSelection(client.sessionId, message.cardId);
    });

    this.onMessage("startGame", (client) => {
      if (this.clients.length >= 2) {
        this.state.gameState = "COLLECTION";
        this.gameLogic.populateInitialDeck();
        this.broadcast("gameStarted", { startedBy: client.sessionId });
        console.log("Game started by", client.sessionId);
      }
    });

    this.onMessage("debug_skipToDuel", (client) => {
      TestUtils.skipToDuel(this.state);
      this.broadcast("deckShuffled"); // Trick client to refresh if needed
    });
  }

  onJoin(client: Client, options: RoomOptions) {
    /**
     * Called when a client joins the room.
     */
    console.log(client.sessionId, "joined!");
    this.state.players.set(client.sessionId, new Player({ name: options.name }));
    this.state.playerDecks.set(client.sessionId, new Deck());
    if (this.clients.length === this.maxClients) {
      this.broadcast("roomIsFull", { message: "Room is full!" });
    }
  }

  onLeave(client: Client, options: any) {
    /**
     * Called when a client leaves the room.
     */
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    /**
     * Called when the room is disposed.
     */
    console.log("room", this.roomId, "disposing...");
  }

}
