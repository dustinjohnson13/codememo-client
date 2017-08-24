//@flow
import User from "../entity/User"

import Card from "../entity/Card"
import Deck from "../entity/Deck"

export const USER_TABLE = "user"
export const CARD_TABLE = "card"
export const DECK_TABLE = "deck"
export const ALL_TABLES = [
    USER_TABLE, CARD_TABLE, DECK_TABLE
]

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

    deleteUser(id: string): Promise<string>;

    deleteCard(id: string): Promise<string>;

    deleteDeck(id: string): Promise<string>;

    findUser(id: string): Promise<User>;

    findCard(id: string): Promise<Card>;

    findDeck(id: string): Promise<Deck>;

    findDecksByUserId(userId: string): Promise<Array<Deck>>;

    findCardsByDeckId(deckId: string): Promise<Array<Card>>;

    findUserByEmail(email: string): Promise<User | void>;
}