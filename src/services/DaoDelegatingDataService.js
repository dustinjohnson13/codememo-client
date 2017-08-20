//@flow
import Deck from "../entity/Deck"
import * as api from "./APIDomain"
import {CollectionResponse, DeckResponse} from "./APIDomain"
import type {Dao} from "../persist/Dao"

export default class {
    dao: Dao

    constructor(dao: Dao) {
        this.dao = dao
    }

    init(clearDatabase: boolean): Promise<void> {
        return this.dao.init(clearDatabase)
    }

    fetchCollection(email: string): Promise<api.CollectionResponse> {
        return this.dao.findCollectionByUserEmail(email)
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
}