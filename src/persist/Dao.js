//@flow
import User from "../entity/User"

import Card from "../entity/Card"
import Deck from "../entity/Deck"
import Collection from "../entity/Collection"

export const USER_TABLE = "user"
export const CARD_TABLE = "card"
export const DECK_TABLE = "deck"
export const COLLECTION_TABLE = "collection"

export const TEST_USER_EMAIL = 'someone@blah.com'
export const TEST_DECK_NAME = 'Test Deck'

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

    deleteUser(id: string): Promise<string>;

    deleteCard(id: string): Promise<string>;

    deleteDeck(id: string): Promise<string>;

    deleteCollection(id: string): Promise<string>;

    findUser(id: string): Promise<User>;

    findCard(id: string): Promise<Card>;

    findDeck(id: string): Promise<Deck>;

    findCollection(id: string): Promise<Collection>;

    findDecksByCollectionId(collectionId: string): Promise<Array<Deck>>;

    findCardsByDeckId(deckId: string): Promise<Array<Card>>;

    findCollectionByUserEmail(email: string): Promise<Collection>;
}