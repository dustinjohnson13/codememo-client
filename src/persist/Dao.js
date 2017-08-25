//@flow
export const USER_TABLE = "user"
export const CARD_TABLE = "card"
export const DECK_TABLE = "deck"
export const ALL_TABLES = [
    USER_TABLE, CARD_TABLE, DECK_TABLE
]

export const TEST_USER_EMAIL = 'someone@blah.com'
export const TEST_DECK_NAME = 'Test Deck'

export class User {
    +id: string
    +email: string

    constructor(id: string, email: string) {
        (this: any).id = id;
        (this: any).email = email;
    }
}

export class Deck {
    +id: string
    +userId: string
    +name: string

    constructor(id: string, userId: string, name: string) {
        (this: any).id = id;
        (this: any).userId = userId;
        (this: any).name = name;
    }
}

export class Card {
    +id: string
    +deckId: string
    +question: string
    +answer: string
    +goodInterval: number
    +due: number

    constructor(id: string, deckId: string, question: string, answer: string, goodInterval: number, due: number) {
        (this: any).id = id;
        (this: any).deckId = deckId;
        (this: any).question = question;
        (this: any).answer = answer;
        (this: any).goodInterval = goodInterval;
        (this: any).due = due;
    }
}

export type Entity = User | Deck | Card

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

    findUser(id: string): Promise<User | void>;

    findCard(id: string): Promise<Card | void>;

    findDeck(id: string): Promise<Deck | void>;

    findDecksByUserId(userId: string): Promise<Array<Deck>>;

    findCardsByDeckId(deckId: string): Promise<Array<Card>>;

    findUserByEmail(email: string): Promise<User | void>;
}