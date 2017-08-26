//@flow
import type {AnswerType, Clock, DataService} from "./APIDomain"
import * as api from "./APIDomain"
import {CardDetail, CardDetailResponse, CollectionResponse, DeckResponse} from "./APIDomain"
import type {Dao} from "../persist/Dao"
import {Card, Deck, newCard, newDeck, newUser, TEST_USER_EMAIL, User} from "../persist/Dao"
import BusinessRules from "./BusinessRules"

export default class DaoDelegatingDataService implements DataService {
    dao: Dao
    clock: Clock
    businessRules: BusinessRules

    constructor(dao: Dao, clock: Clock) {
        this.dao = dao
        this.clock = clock
        this.businessRules = new BusinessRules()
    }

    async init(clearDatabase: boolean): Promise<void> {
        try {
            await this.dao.init(clearDatabase)
            const u = await this.dao.findUserByEmail(TEST_USER_EMAIL)

            if (u === undefined) {
                await this.dao.saveUser(newUser(TEST_USER_EMAIL))
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    async fetchCollection(email: string): Promise<api.CollectionResponse> {
        const user: ?User = await this.dao.findUserByEmail(email)
        if (user) {
            const decks: Array<Deck> = await this.dao.findDecksByUserId(user.id)
            const cardsForDecks: Array<Array<Card>> = await Promise.all(
                decks.map(deck => this.dao.findCardsByDeckId(deck.id)))

            return this.businessRules.decksToAPICollectionResponse(
                this.clock.epochSeconds(), decks, cardsForDecks)
        } else {
            throw new Error(`No user found with email ${email}`)
        }
    }

    async fetchDeck(id: string): Promise<api.DeckResponse> {
        const now = this.clock.epochSeconds()
        const deck = await this.dao.findDeck(id)

        if (deck) {
            const deckName = deck.name
            const cards = await this.dao.findCardsByDeckId(deck.id)

            const apiCards = cards.map(card => this.businessRules.cardToAPICard(now, card))
            return new DeckResponse(id, deckName, apiCards)
        } else {
            // TODO: Need to provide an error message, the deck doesn't exist
            return new DeckResponse(id, "", [])
        }
    }

    async addDeck(email: string, name: string): Promise<CollectionResponse> {
        const user = await this.dao.findUserByEmail(email)
        if (user) {
            await this.dao.saveDeck(newDeck(user.id, name))
            return this.fetchCollection(email)
        } else {
            throw new Error(`No user with email ${email}`)
        }
    }

    async addCard(deckId: string, question: string, answer: string): Promise<CardDetail> {
        const deck = await this.dao.findDeck(deckId)
        if (deck) {
            const card = await this.dao.saveCard(newCard(deck.id, question, answer))
            return this.cardToCardDetail(card)
        } else {
            throw new Error(`No deck with id ${deckId}`)
        }
    }

    async fetchCards(ids: Array<string>): Promise<CardDetailResponse> {
        const cards: Array<Card | void> = await Promise.all(ids.map(id => this.dao.findCard(id)))
        const details = []
        for (let card of cards) {
            if (card) {
                details.push(this.cardToCardDetail(card))
            }
        }
        return new CardDetailResponse(details)
    }

    async answerCard(id: string, answer: AnswerType): Promise<CardDetail> {
        const card = await this.dao.findCard(id)
        if (card) {
            const updated = this.businessRules.cardAnswered(this.clock.epochSeconds(), card, answer)
            const newCard = await this.dao.updateCard(updated)
            return this.cardToCardDetail(newCard)
        } else {
            // TODO: Need to send back an error response
            throw new Error(`Card with id ${id} doens't exist.`)
        }
    }

    cardToCardDetail(card: Card): CardDetail {
        const intervals = this.businessRules.currentAnswerIntervals(card)
        const failInterval = intervals[0]
        const hardInterval = intervals[1]
        const goodInterval = intervals[2]
        const easyInterval = intervals[3]
        return new CardDetail(card.id, card.question, card.answer,
            failInterval, hardInterval, goodInterval, easyInterval, card.due)
    }
}