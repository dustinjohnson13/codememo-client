//@flow
import {CollectionResponse, DeckResponse} from "../APIDomain"
import {createService} from "../../persist/sqlite3/SQLite3Dao.test"
import SQLite3DataService from "./SQLite3DataService"
import {DeckEntity} from "../../persist/sqlite3/SQLite3Dao"
import User from "../../entity/User"
import Collection from "../../entity/Collection"
import Deck from "../../entity/Deck"
import Card from "../../entity/Card"

describe('SQLite3DataService', () => {

    const TOTAL_COUNT = 80;
    const GOOD_COUNT = 30;
    const DUE_COUNT = 27;

    let service

    beforeEach(async () => {
        const dao = createService()

        service = new SQLite3DataService(dao)

        await service.init(true).then(() =>
            dao.saveUser(new User(undefined, 'testuser@blah.com')))
            .then(user => dao.saveCollection(new Collection(undefined, user.id)))
            .then(collection => dao.saveDeck(new Deck(undefined, collection.id, 'Test Deck')))
            .then(deck => {
                const promises = []
                const currentTime = new Date().getTime()
                for (let i = 0; i < TOTAL_COUNT; i++) {
                    const multiplier = i + 1;
                    let dueTime = null;
                    if (i < GOOD_COUNT) {
                        dueTime = currentTime + (86400 * multiplier);
                    } else if (i < (GOOD_COUNT + DUE_COUNT)) {
                        dueTime = currentTime - (86400 * multiplier);
                    }

                    const card = new Card(undefined, deck.id, `Question Number ${i}?`, `Answer Number ${i}`, dueTime);
                    promises.push(dao.saveCard(card))
                }
                return Promise.all(promises)
            })
    })

    it('can add new deck', (done) => {
        expect.assertions(5)

        const deckName = "My New Deck"

        service.addDeck(deckName).then((actual: CollectionResponse) => {
            expect(actual.decks.length).toEqual(2)

            const returnedDeck = actual.decks[1]
            expect(returnedDeck.name).toEqual(deckName)
            expect(returnedDeck.totalCount).toEqual(0)
            expect(returnedDeck.dueCount).toEqual(0)
            expect(returnedDeck.newCount).toEqual(0)

            done()
        })
    })

    it('can fetch decks', (done) => {
        expect.assertions(5)

        service.fetchCollection().then((actual: CollectionResponse) => {
            expect(actual.decks.length).toEqual(1)

            const returnedDeck = actual.decks[0]
            expect(returnedDeck.name).toEqual('Test Deck')
            expect(returnedDeck.totalCount).toEqual(0)
            expect(returnedDeck.dueCount).toEqual(0)
            expect(returnedDeck.newCount).toEqual(0)

            done()
        })
    })

    // it('can add new card', () => {
    //     const deckId = "deck-1"
    //     const question = 'The question'
    //     const answer = 'The answer'
    //
    //     serviceWithDefaultDecks().addCard(deckId, question, answer).then((actual: CardDetail) => {
    //         expect(actual.id).toMatch(/^deck-1-card-\d$/)
    //         expect(actual.question).toEqual(question)
    //         expect(actual.answer).toEqual(answer)
    //         expect(actual.due).toEqual(null)
    //     })
    // })

    it('can fetch deck by id', (done) => {
        expect.assertions(3)

        DeckEntity.findOne().then(deck => deck.id).then(deckId => {
            const idAsString = deckId.toString()
            service.fetchDeck(idAsString).then((actual: DeckResponse) => {
                expect(actual.id).toEqual(idAsString)
                expect(actual.name).toEqual('Test Deck')
                expect(actual.cards.length).toEqual(80)
                done()
            })
        })
    })

})