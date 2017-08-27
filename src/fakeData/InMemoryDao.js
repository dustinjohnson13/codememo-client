//@flow
import type {Dao, Entity} from "../persist/Dao"
import {Card, Deck, newCard, newDeck, NO_ID, Template, User} from "../persist/Dao"
import {ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS} from "../services/APIDomain"

export const fakeDecks = (userId: string, count: number, setId: boolean): Array<Deck> => {
    const decks = []
    for (let i = 0; i < count; i++) {
        const name = `Deck${i}`
        const deck = setId ? new Deck(i.toString(), userId, name) : newDeck(userId, name)
        decks.push(deck)
    }
    return decks;
}

export const fakeCards = (currentTime: number, deckId: string, totalCount: number,
                          dueCount: number, newCount: number, setId: boolean): Array<Card> => {
    const goodCount = totalCount - dueCount - newCount

    if (dueCount + newCount > totalCount) {
        throw new Error("Cannot specify more due and new cards than total!")
    }

    const cards = []
    for (let i = 0; i < totalCount; i++) {
        const question = `Question Number ${i}?`
        const answer = `Answer Number ${i}`

        if (i < goodCount + dueCount) {
            const multiplier = i + 1
            const goodCard = i < goodCount

            const id = setId ? i.toString() : NO_ID
            const goodInterval = goodCard ? TWO_DAYS_IN_SECONDS : ONE_DAY_IN_SECONDS
            const dueTime = goodCard ? currentTime + (ONE_DAY_IN_SECONDS * multiplier) :
                currentTime - (ONE_DAY_IN_SECONDS * multiplier)

            const card = new Card(id, deckId, question, answer, goodInterval, dueTime)
            cards.push(card)
        } else {
            let card = newCard(deckId, question, answer)

            if (setId) {
                card = new Card(i.toString(), card.deckId, card.question, card.answer, card.goodInterval, card.due)
            }

            cards.push(card)
        }
    }

    return cards
}

export class InMemoryDao implements Dao {
    users: Array<User> = []
    decks: Array<Deck> = []
    templates: Array<Template> = []
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
        const id = user.id

        if (id === NO_ID) {
            throw new Error("Unable to update non-persisted user!")
        }

        if (this.users.find(it => it.id === id) === undefined) {
            throw new Error("Unable to update non-existent user!")
        }

        this.users = this.updateEntity(user, this.users)
        return Promise.resolve(user)
    }

    saveTemplate(template: Template): Promise<Template> {
        const creator = id => new Template(id, template.deckId, template.type, template.field1, template.field2)
        this.templates = this.saveEntity(creator, this.templates)
        return Promise.resolve(this.templates[this.templates.length - 1])
    }

    updateTemplate(template: Template): Promise<Template> {
        const id = template.id

        if (id === NO_ID) {
            throw new Error("Unable to update non-persisted template!")
        }

        if (this.templates.find(it => it.id === id) === undefined) {
            throw new Error("Unable to update non-existent template!")
        }

        this.templates = this.updateEntity(template, this.templates)
        return Promise.resolve(template)
    }

    saveCard(card: Card): Promise<Card> {
        const creator = id => new Card(id, card.deckId, card.question, card.answer, card.goodInterval, card.due)
        this.cards = this.saveEntity(creator, this.cards)
        return Promise.resolve(this.cards[this.cards.length - 1])
    }

    updateCard(card: Card): Promise<Card> {
        const id = card.id

        if (id === NO_ID) {
            throw new Error("Unable to update non-persisted card!")
        }

        if (this.cards.find(it => it.id === id) === undefined) {
            throw new Error("Unable to update non-existent card!")
        }

        this.cards = this.updateEntity(card, this.cards)
        return Promise.resolve(card)
    }

    saveDeck(deck: Deck): Promise<Deck> {
        const creator = id => new Deck(id, deck.userId, deck.name)
        this.decks = this.saveEntity(creator, this.decks)
        return Promise.resolve(this.decks[this.decks.length - 1])
    }

    updateDeck(deck: Deck): Promise<Deck> {
        const id = deck.id

        if (id === NO_ID) {
            throw new Error("Unable to update non-persisted deck!")
        }

        if (this.decks.find(it => it.id === id) === undefined) {
            throw new Error("Unable to update non-existent deck!")
        }

        this.decks = this.updateEntity(deck, this.decks)
        return Promise.resolve(deck)
    }

    deleteUser(id: string): Promise<string> {
        this.users = this.users.filter(it => it.id !== id)
        return Promise.resolve(id)
    }

    deleteTemplate(id: string): Promise<string> {
        this.templates = this.templates.filter(it => it.id !== id)
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

    findTemplate(id: string): Promise<Template | void> {
        return this.findEntity(id, this.templates)
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