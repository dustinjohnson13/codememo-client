//@flow
import type {AnswerType, Clock, DataService} from "./APIDomain"
import * as api from "./APIDomain"
import {
    CardDetail,
    CardDetailResponse,
    CollectionResponse,
    DeckResponse,
    DUE_IMMEDIATELY,
    NO_ID,
    ONE_DAY_IN_SECONDS
} from "./APIDomain"
import type {Dao} from "../persist/Dao"
import {Card, Deck, TEST_USER_EMAIL, User} from "../persist/Dao"
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

    init(clearDatabase: boolean): Promise<void> {
        return this.dao.init(clearDatabase).then(() => {
            return this.dao.findUserByEmail(TEST_USER_EMAIL)
                .then(u => {
                    if (u === undefined) {
                        return this.dao.saveUser(new User(NO_ID, TEST_USER_EMAIL)).then(() => undefined)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    }

    fetchCollection(email: string): Promise<api.CollectionResponse> {
        return this.dao.findUserByEmail(email)
            .then(user => user ? this.dao.findDecksByUserId(user.id) : [])
            .then(decks => new api.CollectionResponse(decks.map(it =>
                    new api.Deck(it.id, it.name, 0, 0, 0)
                ))
            )
    }

    fetchDeck(id: string): Promise<api.DeckResponse> {
        const now = this.clock.epochSeconds()

        return this.dao.findDeck(id)
            .then(deck => {
                    if (deck) {
                        const deckName = deck.name
                        return this.dao.findCardsByDeckId(deck.id)
                            .then(cards => cards.map(card => // TODO: Move to business rules
                                new api.Card(card.id, (card.due === DUE_IMMEDIATELY) ? 'NEW' : card.due > now ? 'OK' : 'DUE')))
                            .then(apiCards => new DeckResponse(id, deckName, apiCards))
                    } else {
                        // TODO: Need to provide an error message, the deck doesn't exist
                        return new DeckResponse(id, "", [])
                    }
                }
            )
    }

    addDeck(email: string, name: string): Promise<CollectionResponse> {
        return this.dao.findUserByEmail(email)
        //$FlowFixMe
            .then(user => this.dao.saveDeck(new Deck(undefined, user.id, name)))
            .then(deck => this.fetchCollection(email))
    }

    addCard(deckId: string, question: string, answer: string): Promise<CardDetail> {
        return this.dao.findDeck(deckId)
        // $FlowFixMe
            .then(deck => this.dao.saveCard(new Card(undefined, deck.id, question, answer, ONE_DAY_IN_SECONDS, undefined)))
            .then(card => this.cardToCardDetail(card))
    }

    fetchCards(ids: Array<string>): Promise<CardDetailResponse> {
        return Promise.all(ids.map(id => this.dao.findCard(id))).then((cards => {
                const details = []
                for (let card of cards) {
                    if (card) {
                        details.push(this.cardToCardDetail(card))
                    }
                }
                return new CardDetailResponse(details)
            }
        ))
    }

    answerCard(id: string, answer: AnswerType): Promise<CardDetail> {
        return this.dao.findCard(id)
            .then(card => {
                if (card) {
                    const updated = this.businessRules.cardAnswered(this.clock.epochSeconds(), card, answer)
                    return this.dao.updateCard(updated)
                        .then(card => this.cardToCardDetail(card))
                } else {
                    // TODO: Need to send back an error response
                    throw new Error(`Card with id ${id} doens't exist.`)
                }
            })
    }

    cardToCardDetail(card: Card) {
        const intervals = this.businessRules.currentAnswerIntervals(card)
        const failInterval = intervals[0]
        const hardInterval = intervals[1]
        const goodInterval = intervals[2]
        const easyInterval = intervals[3]
        return new CardDetail(card.id, card.question, card.answer,
            failInterval, hardInterval, goodInterval, easyInterval, card.due)
    }
}