//@flow
import User from "../entity/User"

import Card from "../entity/Card"
import Deck from "../entity/Deck"
import Collection from "../entity/Collection"

export const USER_TABLE = "user"
export const CARD_TABLE = "card"
export const DECK_TABLE = "deck"
export const COLLECTION_TABLE = "collection"

export interface Dao {

    init(clearDatabase: boolean): Promise<void>;

    saveUser(user: User): Promise<User>;

    updateUser(user: User): Promise<User>;

    saveCard(card: Card): Promise<Card>;

    updateCard(card: Card): Promise<Card>;

    saveDeck(deck: Deck): Promise<Deck>;

    updateDeck(deck: Deck): Promise<Deck>;

    saveCollection(collection: Collection): Promise<Collection>;

    updateCollection(collection: Collection): Promise<Collection>;

    deleteUser(id: number): Promise<number>;

    deleteCard(id: string): Promise<string>;

    deleteDeck(id: string): Promise<string>;

    deleteCollection(id: number): Promise<number>;

    findUser(id: number): Promise<User>;

    findCard(id: number): Promise<Card>;

    findDeck(id: number): Promise<Deck>;

    findCollection(id: number): Promise<Collection>;

    findDecksByCollectionId(collectionId: number): Promise<Array<Deck>>;

    findCardsByDeckId(deckId: number): Promise<Array<Card>>;

    findCollectionByUserEmail(email: string): Promise<Collection>;
}