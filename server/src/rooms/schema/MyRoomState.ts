import { MapSchema, ArraySchema, Schema, type } from "@colyseus/schema";
import { Card } from "./Card.js";
import { Deck } from "./Deck.js";
import { Player } from "./Player.js";

export { Card, Deck, Player };

function generateRandomDeck(): Deck {
  const deck = new Deck();
  const cardNames = ["Dragon", "Phoenix", "Knight", "Wizard", "Castle", "Potion", "Sword", "Shield", "Crown", "Ghost"];

  // Create 20 random cards
  for (let i = 0; i < 20; i++) {
    const randomName = cardNames[Math.floor(Math.random() * cardNames.length)] + " " + Math.floor(Math.random() * 100);
    deck.cards.push(new Card(randomName));
  }

  return deck;
}

export class MyState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type(Deck) mainDeck: Deck = generateRandomDeck();
  @type([Card]) deckToView = new ArraySchema<Card>();
  @type({ map: Deck }) playerDecks = new MapSchema<Deck>();
  @type("string") gameState: string = "LOBBY";
  @type("number") shuffleCountdown: number = 5;
}