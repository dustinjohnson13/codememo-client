//@flow
import {ONE_DAY_IN_SECONDS} from "../services/APIDomain"

export const USER_TABLE = "user"
export const CARD_TABLE = "card"
export const TEMPLATE_TABLE = "template"
export const DECK_TABLE = "deck"
export const ALL_TABLES = [
    USER_TABLE, CARD_TABLE, TEMPLATE_TABLE, DECK_TABLE
]

export const NO_ID = "NONE"
export const DUE_IMMEDIATELY = -1
export const TEST_USER_EMAIL = 'someone@blah.com'
export const TEST_DECK_NAME = 'Test Deck'

export const Templates = {
    FRONT_BACK: 'FRONT_BACK'
}

export type TemplateType = $Keys<typeof Templates>;

export const templateTypeToDBId = (type: TemplateType): number => {
    switch (type) {
        case Templates.FRONT_BACK:
            return 1
        default:
            throw new Error(`Unrecognized type: ${type}`)
    }
}

export const templateTypeFromDBId = (id: number): TemplateType => {
    switch (id) {
        case 1:
            return Templates.FRONT_BACK
        default:
            throw new Error(`Unrecognized Template DB id: ${id}`)
    }
}

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

export class Template {
    +id: string
    +deckId: string
    +type: TemplateType
    +field1: string
    +field2: string

    constructor(id: string, deckId: string, type: TemplateType, field1: string, field2: string) {
        (this: any).id = id;
        (this: any).deckId = deckId;
        (this: any).type = type;
        (this: any).field1 = field1;
        (this: any).field2 = field2;
    }
}

export class Card {
    +id: string
    +templateId: string
    +cardNumber: number
    +goodInterval: number
    +due: number

    constructor(id: string, templateId: string, cardNumber: number, goodInterval: number, due: number) {
        (this: any).id = id;
        (this: any).templateId = templateId;
        (this: any).cardNumber = cardNumber;
        (this: any).goodInterval = goodInterval;
        (this: any).due = due;
    }
}

export type Entity = User | Deck | Template | Card

export interface Dao {

    init(clearDatabase: boolean): Promise<void>;

    saveUser(user: User): Promise<User>;

    updateUser(user: User): Promise<User>;

    saveTemplate(template: Template): Promise<Template>;

    updateTemplate(template: Template): Promise<Template>;

    saveCard(card: Card): Promise<Card>;

    updateCard(card: Card): Promise<Card>;

    saveDeck(deck: Deck): Promise<Deck>;

    updateDeck(deck: Deck): Promise<Deck>;

    deleteUser(id: string): Promise<string>;

    deleteTemplate(id: string): Promise<string>;

    deleteCard(id: string): Promise<string>;

    deleteDeck(id: string): Promise<string>;

    findUser(id: string): Promise<User | void>;

    findTemplate(id: string): Promise<Template | void>;

    findCard(id: string): Promise<Card | void>;

    findDeck(id: string): Promise<Deck | void>;

    findDecksByUserId(userId: string): Promise<Array<Deck>>;

    findCardsByDeckId(deckId: string): Promise<Array<Card>>;

    findUserByEmail(email: string): Promise<User | void>;
}

export const newUser = (email: string) => new User(NO_ID, email)

export const newDeck = (userId: string, name: string) => new Deck(NO_ID, userId, name)

export const newTemplate = (deckId: string, type: TemplateType, field1: string, field2: string) =>
    new Template(NO_ID, deckId, type, field1, field2)

export const newCard = (templateId: string, cardNumber: number) =>
    new Card(NO_ID, templateId, cardNumber, ONE_DAY_IN_SECONDS, DUE_IMMEDIATELY)