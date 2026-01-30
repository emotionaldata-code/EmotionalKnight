import { Schema, type } from "@colyseus/schema";

export class Player extends Schema {
    @type("string") name: string;
    @type("number") x: number = Math.floor(Math.random() * 100);
    @type("number") y: number = Math.floor(Math.random() * 100);
    @type("boolean") hasSelected: boolean = false;
    @type("boolean") isSelecting: boolean = false;

    constructor(data: any) {
        super();
        this.name = data.name;
    }
}
