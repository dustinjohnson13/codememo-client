import {CollectionEntity, SQLite3Dao} from "../../persist/sqlite3/SQLite3Dao"
import Deck from "../../entity/Deck"
import * as api from "../APIDomain"
import {DeckResponse} from "../APIDomain"

export default class {
    dao: SQLite3Dao

    constructor(dao: SQLite3Dao) {
        this.dao = dao
    }

    init(clearDatabase: boolean): Promise<void> {
        return this.dao.init(clearDatabase)
    }

    fetchCollection(): Promise<api.CollectionResponse> {
        return CollectionEntity.findOne()
            .then(collection => this.dao.findDecksByCollectionId(collection.id))
            .then(decks => new api.CollectionResponse(decks.map(it =>
                new api.Deck(it.id.toString(), it.name, 0, 0, 0)
            )))
    }

    fetchDeck(id: string): Promise<api.DeckResponse> {
        const now = new Date().getTime()

        return this.dao.findDeck(parseInt(id))
            .then(deck => this.dao.findCardsByDeckId(deck.id)
                .then(cards => cards.map(card =>
                    new api.Card(card.id.toString(), card.due === null ? 'NEW' : card.due > now ? 'OK' : 'DUE')))
                .then(apiCards => new DeckResponse(id, deck.name, apiCards))
            )
    }

    addDeck(name: string): Promise<CollectionResponse> {
        return CollectionEntity.findOne()
            .then(collection => this.dao.saveDeck(new Deck(undefined, collection.id, name)))
            .then(deck => this.fetchCollection())
    }
}