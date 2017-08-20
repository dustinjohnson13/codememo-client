//@flow
import Deck from "../entity/Deck"
import type {DataService} from "./APIDomain"
import * as api from "./APIDomain"
import {CardDetail, CardDetailResponse, CollectionResponse, DeckResponse} from "./APIDomain"
import type {Dao} from "../persist/Dao"
import Card from "../entity/Card"

const cardToCardDetail = (card: Card) => {
    //$FlowFixMe
    return new CardDetail(card.id, card.question, card.answer, 9999, 9999, 9999, 9999, card.due)
}

export default class DaoDelegatingDataService implements DataService {
    dao: Dao

    constructor(dao: Dao) {
        this.dao = dao
    }

    init(clearDatabase: boolean): Promise<void> {
        return this.dao.init(clearDatabase)
    }

    fetchCollection(email: string): Promise<api.CollectionResponse> {
        return this.dao.findCollectionByUserEmail(email)
        // $FlowFixMe
            .then(collection => this.dao.findDecksByCollectionId(collection.id))
            .then(decks => new api.CollectionResponse(decks.map(it =>
                    //$FlowFixMe
                    new api.Deck(it.id, it.name, 0, 0, 0)
                ))
            )
    }

    fetchDeck(id: string): Promise<api.DeckResponse> {
        const now = new Date().getTime()

        return this.dao.findDeck(id)
        //$FlowFixMe
            .then(deck => this.dao.findCardsByDeckId(deck.id)
                .then(cards => cards.map(card =>
                    //$FlowFixMe
                    new api.Card(card.id, (!card.due) ? 'NEW' : card.due > now ? 'OK' : 'DUE')))
                .then(apiCards => new DeckResponse(id, deck.name, apiCards))
            )
    }

    addDeck(email: string, name: string): Promise<CollectionResponse> {
        return this.dao.findCollectionByUserEmail(email)
        // $FlowFixMe
            .then(collection => this.dao.saveDeck(new Deck(undefined, collection.id, name)))
            .then(deck => this.fetchCollection(email))
    }

    addCard(deckId: string, question: string, answer: string): Promise<CardDetail> {
        return this.dao.findDeck(deckId)
        // $FlowFixMe
            .then(deck => this.dao.saveCard(new Card(undefined, deck.id, question, answer, undefined)))
            .then(card => cardToCardDetail(card))
    }

    fetchCards(ids: Array<string>): Promise<CardDetailResponse> {
        return Promise.all(ids.map(id => this.dao.findCard(id))).then((cards =>
                new CardDetailResponse(cards.map(card => cardToCardDetail(card)))
        ))
    }

    answerCard(id: string, answer: string): Promise<CardDetail> {
        return this.dao.findCard(id).then(card =>
            new Card(card.id, card.deckId, card.question, card.answer, card.due + new Date().getTime() + 86400))
            .then(card => this.dao.saveCard(card))
            .then(card => cardToCardDetail(card))
    }
}