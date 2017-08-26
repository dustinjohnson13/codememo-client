//@flow
import type {Dao, Entity} from "../persist/Dao"
import {Card, Deck, User} from "../persist/Dao"

export class InMemoryDao implements Dao {
    users: Array<User> = []
    decks: Array<Deck> = []
    cards: Array<Card> = []
    idCounter: number

    constructor() {
        this.idCounter = 1
    }

    saveUser(user: User): Promise<User> {
        const creator = id => new User(id, user.email)
        this.users = this.saveEntity(creator, this.users)
        return Promise.resolve(this.users[this.users.length - 1])
    }

    updateUser(user: User): Promise<User> {
        this.users = this.updateEntity(user, this.users)
        return Promise.resolve(user)
    }

    saveCard(card: Card): Promise<Card> {
        const creator = id => new Card(id, card.deckId, card.question, card.answer, card.goodInterval, card.due)
        this.cards = this.saveEntity(creator, this.cards)
        return Promise.resolve(this.cards[this.cards.length - 1])
    }

    updateCard(card: Card): Promise<Card> {
        this.cards = this.updateEntity(card, this.cards)
        return Promise.resolve(card)
    }

    saveDeck(deck: Deck): Promise<Deck> {
        const creator = id => new Deck(id, deck.userId, deck.name)
        this.decks = this.saveEntity(creator, this.decks)
        return Promise.resolve(this.decks[this.decks.length - 1])
    }

    updateDeck(deck: Deck): Promise<Deck> {
        this.decks = this.updateEntity(deck, this.decks)
        return Promise.resolve(deck)
    }

    deleteUser(id: string): Promise<string> {
        this.users = this.users.filter(it => it.id !== id)
        return Promise.resolve(id)
    }

    deleteCard(id: string): Promise<string> {
        this.cards = this.cards.filter(it => it.id !== id)
        return Promise.resolve(id)
    }

    deleteDeck(id: string): Promise<string> {
        this.decks = this.decks.filter(it => it.id !== id)
        return Promise.resolve(id)
    }

    findUser(id: string): Promise<User | void> {
        return this.findEntity(id, this.users)
    }

    findCard(id: string): Promise<Card | void> {
        return this.findEntity(id, this.cards)
    }

    findDeck(id: string): Promise<Deck | void> {
        return this.findEntity(id, this.decks)
    }

    findDecksByUserId(userId: string): Promise<Array<Deck>> {
        return Promise.resolve(this.decks.filter(it => it.userId === userId))
    }

    findCardsByDeckId(deckId: string): Promise<Array<Card>> {
        return Promise.resolve(this.cards.filter(it => it.deckId === deckId))
    }

    findUserByEmail(email: string): Promise<User | void> {
        return Promise.resolve(this.users.find(it => it.email === email))
    }

    init(clearDatabase: boolean): Promise<void> {
        if (clearDatabase) {
            this.users = []
            this.decks = []
            this.cards = []
        }
        return Promise.resolve()
    }

    saveEntity<T>(func: (id: string) => T, array: Array<T>): Array<T> {
        const entity = func("" + this.idCounter++)
        return [...array, entity]
    }

    updateEntity<T:Entity>(entity: T, array: Array<T>): Array<T> {
        const newArray = array.filter(it => it.id !== entity.id)
        newArray.push(entity)
        return newArray
    }

    findEntity<T: Entity>(id: string, array: Array<T>): Promise<T | void> {
        return Promise.resolve(array.find(it => it.id === id))
    }
}