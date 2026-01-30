import { Schema, type } from "@colyseus/schema";

export class Card extends Schema {
    @type("string") id: string;
    @type("string") name: string;
    @type("boolean") isRemoved: boolean = false;

    constructor(name: string) {
        super();
        this.id = Math.random().toString(36).substring(2, 9);
        this.name = name;
    }
}
