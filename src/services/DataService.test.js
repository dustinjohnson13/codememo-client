//@flow
import {Answer, CollectionResponse} from "./APIDomain"
import DaoDelegatingDataService from "./DaoDelegatingDataService"
import {Deck, DUE_IMMEDIATELY, NO_ID, TEST_DECK_NAME, TEST_USER_EMAIL} from "../persist/Dao"
import {FrozenClock} from "./__mocks__/API"
import {fakeCards} from "../fakeData/InMemoryDao"

describe('Placeholder', () => {
    it('needs this placeholder', () => {
        expect(true).toBeTruthy()
    })
})

export function testServiceWithDaoImplementation(createDao: any) {
    describe('DataService', () => {

        const TOTAL_COUNT = 80
        const GOOD_COUNT = 30
        const DUE_COUNT = 27

        const clock = new FrozenClock()
        let service

        beforeEach(async () => {
            const dao = createDao()

            service = new DaoDelegatingDataService(dao, clock)

            await service.init(true).then(() =>
                dao.findUserByEmail(TEST_USER_EMAIL)
                    .then(user => dao.saveDeck(new Deck(NO_ID, user.id, TEST_DECK_NAME)))
                    .then(deck => {
                        const currentTime = clock.epochSeconds()
                        const cards = fakeCards(currentTime, deck.id, TOTAL_COUNT,
                            DUE_COUNT, TOTAL_COUNT - GOOD_COUNT - DUE_COUNT, false)

                        return Promise.all(cards.map(card => dao.saveCard(card)))
                    }))
        })

        it('can add new deck', async () => {

            const deckName = "My New Deck"

            const actual = await service.addDeck(TEST_USER_EMAIL, deckName)
            expect(actual.decks.length).toEqual(2)

            const returnedDeck = actual.decks.find(it => it.name === deckName)
            expect(returnedDeck).toBeDefined()
            if (returnedDeck) {
                expect(returnedDeck.name).toEqual(deckName)
                expect(returnedDeck.totalCount).toEqual(0)
                expect(returnedDeck.dueCount).toEqual(0)
                expect(returnedDeck.newCount).toEqual(0)
            }
        })

        it('can fetch collection', async () => {

            const actual: CollectionResponse = await service.fetchCollection(TEST_USER_EMAIL)
            expect(actual.decks.length).toEqual(1)

            const returnedDeck = actual.decks[0]
            expect(returnedDeck.name).toEqual(TEST_DECK_NAME)
            expect(returnedDeck.totalCount).toEqual(TOTAL_COUNT)
            expect(returnedDeck.dueCount).toEqual(DUE_COUNT)
            expect(returnedDeck.newCount).toEqual(TOTAL_COUNT - DUE_COUNT - GOOD_COUNT)
        })

        it('can fetch decks', async () => {
            const actual = await service.fetchCollection(TEST_USER_EMAIL)
            const deck = await service.fetchDeck(actual.decks[0].id)

            expect(deck.name).toEqual(TEST_DECK_NAME)
            expect(deck.cards.length).toEqual(TOTAL_COUNT)
        })

        it('can add new card', async () => {
            const question = 'The question'
            const answer = 'The answer'

            const collection = await service.fetchCollection(TEST_USER_EMAIL)
            const decks = collection.decks
            const deckId = decks[0].id
            const actual = await service.addCard(deckId, question, answer)

            expect(actual.id).toBeDefined()
            expect(actual.question).toEqual(question)
            expect(actual.answer).toEqual(answer)
            expect(actual.due).toEqual(DUE_IMMEDIATELY)
        })

        it('can fetch deck by id', async () => {
            const collection = await service.fetchCollection(TEST_USER_EMAIL)
            const decks = collection.decks
            const idAsString = decks[0].id
            const actual = await service.fetchDeck(idAsString)

            expect(actual.id).toEqual(idAsString)
            expect(actual.name).toEqual(TEST_DECK_NAME)
            expect(actual.cards.length).toEqual(80)
        })

        it('can answer due card, should schedule interval based on answer', async () => {
            const collection = await service.fetchCollection(TEST_USER_EMAIL)
            const decks = collection.decks
            const deckId = decks[0].id
            const deck = await service.fetchDeck(deckId)
            const response = await service.fetchCards(deck.cards.map(card => card.id))
            const cardsWithDueTime = response.cards.filter(card => card.due && card.due !== DUE_IMMEDIATELY &&
                card.due < clock.epochSeconds())

            if (!cardsWithDueTime) {
                throw new Error("Unable to find cards with due time!")
            }

            const card = cardsWithDueTime[0]
            const originalDue = card.due
            const originalGoodInterval = card.goodInterval

            const answeredCard = await service.answerCard(card.id, Answer.GOOD)
            const newDue = answeredCard.due
            const newGoodInterval = answeredCard.goodInterval

            expect(originalDue).toBeGreaterThan(0)
            expect(newDue).toBeGreaterThan(originalDue)
            expect(newGoodInterval).toBeGreaterThan(originalGoodInterval)
        })
    })
}