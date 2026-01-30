import { Schema, type, ArraySchema } from "@colyseus/schema";
import { Card } from "./Card.js";

export class Deck extends Schema {
    @type([Card]) cards = new ArraySchema<Card>();
}
