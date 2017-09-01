//@flow
import type {Dao, Entity} from "../persist/Dao"
import {Card, Deck, Format, newCard, newDeck, newReview, NO_ID, Review, Template, Templates, User} from "../persist/Dao"
import {Answer, MILLIS_PER_DAY, MILLIS_PER_MINUTE, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS} from "../services/APIDomain"

export const REVIEW_END_TIME = 1508331802

export const fakeDecks = (userId: string, count: number, setId: boolean): Array<Deck> => {
    const decks = []
    for (let i = 0; i < count; i++) {
        const name = `Deck${i}`
        const deck = setId ? new Deck(i.toString(), userId, name) : newDeck(userId, name)
        decks.push(deck)
    }
    return decks;
}

// TODO: Split up template and card creation
export const fakeCards = (currentTime: number, deckId: string, totalCount: number,
                          dueCount: number, newCount: number, setId: boolean): { templates: Array<Template>, cards: Array<Card> } => {
    const goodCount = totalCount - dueCount - newCount

    if (dueCount + newCount > totalCount) {
        throw new Error("Cannot specify more due and new cards than total!")
    }

    const templates = []
    const cards = []
    for (let i = 0; i < totalCount; i++) {
        const plain = i % 2 === 0
        const format = plain ? Format.PLAIN : Format.HTML
        const prefix = plain ? "" : "<div><b>"
        const suffix = plain ? "" : "</b></div>"

        const question = `${prefix}Question Number ${i}?${suffix}`
        const answer = `Answer Number ${i}`

        const templateId = setId ? (i * 100).toString() : NO_ID
        const template = new Template(templateId, deckId, Templates.FRONT_BACK, format, question, answer)
        templates.push(template)

        if (i < goodCount + dueCount) {
            const multiplier = i + 1
            const goodCard = i < goodCount

            const id = setId ? i.toString() : NO_ID
            const goodInterval = goodCard ? MINUTES_PER_TWO_DAYS : MINUTES_PER_DAY
            const dueTime = goodCard ? currentTime + (MILLIS_PER_DAY * multiplier) :
                currentTime - (MILLIS_PER_DAY * multiplier)

            const card = new Card(id, template.id, 1, goodInterval, dueTime)
            cards.push(card)
        } else {
            let card = newCard(template.id, 1)

            if (setId) {
                card = new Card(i.toString(), card.templateId, card.cardNumber, card.goodInterval, card.due)
            }

            cards.push(card)
        }
    }

    return {templates: templates, cards: cards}
}

export const fakeReviews = (currentTime: number, cardId: string, count: number, setId: boolean): Array<Review> => {
    const reviews = []
    for (let i = 0; i < count; i++) {
        const endTime = currentTime - i
        const startTime = endTime - MILLIS_PER_MINUTE
        const answer = Answer.GOOD
        const review = setId ? new Review(i.toString(), cardId, startTime, endTime, answer) : newReview(cardId, startTime, endTime, answer)
        reviews.push(review)
    }
    return reviews;
}

export class InMemoryDao implements Dao {
    users: Array<User> = []
    decks: Array<Deck> = []
    templates: Array<Template> = []
    cards: Array<Card> = []
    reviews: Array<Review> = []
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
        const creator = id => new Template(id, template.deckId, template.type, template.format, template.field1, template.field2)
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
        const creator = id => new Card(id, card.templateId, card.cardNumber, card.goodInterval, card.due)
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

    saveReview(review: Review): Promise<Review> {
        const creator = id => new Review(id, review.cardId, review.startTime, review.endTime, review.answer)
        this.reviews = this.saveEntity(creator, this.reviews)
        return Promise.resolve(this.reviews[this.reviews.length - 1])
    }

    updateReview(review: Review): Promise<Review> {
        const id = review.id

        if (id === NO_ID) {
            throw new Error("Unable to update non-persisted review!")
        }

        if (this.reviews.find(it => it.id === id) === undefined) {
            throw new Error("Unable to update non-existent review!")
        }

        this.reviews = this.updateEntity(review, this.reviews)
        return Promise.resolve(review)
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

    deleteReview(id: string): Promise<string> {
        this.reviews = this.reviews.filter(it => it.id !== id)
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

    findReview(id: string): Promise<Review | void> {
        return this.findEntity(id, this.reviews)
    }

    findReviewsByCardId(cardId: string): Promise<Array<Review>> {
        return Promise.resolve(this.reviews.filter(it => it.cardId === cardId))
    }

    findDecksByUserId(userId: string): Promise<Array<Deck>> {
        return Promise.resolve(this.decks.filter(it => it.userId === userId))
    }

    findCardsByDeckId(deckId: string): Promise<Array<Card>> {
        const templateIds = this.templates.filter(it => it.deckId === deckId).map(it => it.id)
        return Promise.resolve(this.cards.filter(it => templateIds.indexOf(it.templateId) !== -1))
    }

    findCardsByTemplateId(templateId: string): Promise<Array<Card>> {
        return Promise.resolve(this.cards.filter(it => it.templateId === templateId))
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