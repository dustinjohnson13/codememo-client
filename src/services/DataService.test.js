//@flow
import {
    CardDetail,
    CollectionResponse,
    DeckResponse,
    EASY,
    FAIL,
    GOOD,
    HALF_DAY_IN_SECONDS,
    HARD,
    ONE_DAY_IN_SECONDS,
    TWO_DAYS_IN_SECONDS
} from "./APIDomain"
import DaoDelegatingDataService from "./DaoDelegatingDataService"
import Deck from "../entity/Deck"
import Card from "../entity/Card"
import {createDao} from "../persist/sequelize/SequalizeDao.test"
import {TEST_DECK_NAME, TEST_USER_EMAIL} from "../persist/Dao"
import {
    ACCESS_KEY_ID,
    DYNAMODB_TEST_TIMEOUT,
    REGION,
    SECRET_ACCESS_KEY,
    startAndLoadData,
    stop
} from "../persist/dynamodb/DynamoDBHelper"
import DynamoDBDao from "../persist/dynamodb/DynamoDBDao"
import {InMemoryDao} from "../fakeData/InMemoryDao"
import {FrozenClock} from "./__mocks__/API"

describe('DaoDelegatingDataService - FakeDataDao', () => {
    testWithDaoImplementation(() => new InMemoryDao())
})

describe('DaoDelegatingDataService - sequelize (sqlite3)', () => {
    testWithDaoImplementation(createDao)
})

describe('DaoDelegatingDataService - DynamoDB', () => {
    let port
    let dao
    let originalTimeout

    beforeAll(async () => {
        await startAndLoadData(false).then((assignedPort: number) => {
            port = assignedPort
            dao = new DynamoDBDao(REGION, `http://localhost:${port}`, ACCESS_KEY_ID, SECRET_ACCESS_KEY)
        })
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
        jasmine.DEFAULT_TIMEOUT_INTERVAL = DYNAMODB_TEST_TIMEOUT
    })

    afterAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
        stop(port)
    })

    testWithDaoImplementation(() => dao)
})

function testWithDaoImplementation(createDao: any) {
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
                    .then(user => dao.saveDeck(new Deck(undefined, user.id, TEST_DECK_NAME)))
                    .then(deck => {
                        const promises = []
                        const currentTime = new Date().getTime()
                        for (let i = 0; i < TOTAL_COUNT; i++) {
                            const multiplier = i + 1
                            let dueTime = null
                            let goodInterval = HALF_DAY_IN_SECONDS
                            if (i < GOOD_COUNT) {
                                dueTime = currentTime + (ONE_DAY_IN_SECONDS * multiplier)
                                goodInterval = TWO_DAYS_IN_SECONDS
                            } else if (i < (GOOD_COUNT + DUE_COUNT)) {
                                dueTime = currentTime - (ONE_DAY_IN_SECONDS * multiplier)
                                goodInterval = ONE_DAY_IN_SECONDS
                            }

                            const card = new Card(undefined, deck.id, `Question Number ${i}?`, `Answer Number ${i}`, goodInterval, dueTime)
                            promises.push(dao.saveCard(card))
                        }
                        return Promise.all(promises)
                    }))
        })

        it('can add new deck', (done) => {

            expect.assertions(6)

            const deckName = "My New Deck"

            service.addDeck(TEST_USER_EMAIL, deckName).then((actual: CollectionResponse) => {
                expect(actual.decks.length).toEqual(2)

                const returnedDeck = actual.decks.find(it => it.name === deckName)
                expect(returnedDeck).toBeDefined()
                if (returnedDeck) {
                    expect(returnedDeck.name).toEqual(deckName)
                    expect(returnedDeck.totalCount).toEqual(0)
                    expect(returnedDeck.dueCount).toEqual(0)
                    expect(returnedDeck.newCount).toEqual(0)
                }
                done()
            })
        })

        it('can fetch collection', (done) => {
            expect.assertions(5)

            service.fetchCollection(TEST_USER_EMAIL).then((actual: CollectionResponse) => {
                expect(actual.decks.length).toEqual(1)

                const returnedDeck = actual.decks[0]
                expect(returnedDeck.name).toEqual(TEST_DECK_NAME)
                expect(returnedDeck.totalCount).toEqual(0)
                expect(returnedDeck.dueCount).toEqual(0)
                expect(returnedDeck.newCount).toEqual(0)

                done()
            })
        })

        it('can fetch decks', (done) => {
            expect.assertions(2)

            service.fetchCollection(TEST_USER_EMAIL)
                .then((actual: CollectionResponse) => service.fetchDeck(actual.decks[0].id))
                .then(deck => {
                    expect(deck.name).toEqual(TEST_DECK_NAME)
                    expect(deck.cards.length).toEqual(80)
                    done()
                })
        })

        it('can add new card', (done) => {
            expect.assertions(4)

            const question = 'The question'
            const answer = 'The answer'

            service.fetchCollection(TEST_USER_EMAIL)
                .then(collection => collection.decks)
                .then(decks => decks[0].id)
                .then(deckId => {
                    service.addCard(deckId, question, answer).then((actual: CardDetail) => {
                        expect(actual.id).toBeDefined()
                        expect(actual.question).toEqual(question)
                        expect(actual.answer).toEqual(answer)
                        expect(actual.due).toBeUndefined()
                        done()
                    })
                })
        })

        it('can fetch deck by id', (done) => {
            expect.assertions(3)

            service.fetchCollection(TEST_USER_EMAIL)
                .then(collection => collection.decks)
                .then(decks => decks[0].id)
                .then(idAsString => {
                    service.fetchDeck(idAsString).then((actual: DeckResponse) => {
                        expect(actual.id).toEqual(idAsString)
                        expect(actual.name).toEqual(TEST_DECK_NAME)
                        expect(actual.cards.length).toEqual(80)
                        done()
                    })
                })
        })

        it('can answer due card, should schedule interval based on answer', (done) => {
            expect.assertions(13)

            service.fetchCollection(TEST_USER_EMAIL)
                .then(collection => collection.decks)
                .then(decks => decks[0].id)
                .then(deckId => service.fetchDeck(deckId))
                .then(deck => service.fetchCards(deck.cards.map(card => card.id)))
                .then(response => {
                    const cardsWithDueTime = response.cards.filter(card => card.due && card.goodInterval === TWO_DAYS_IN_SECONDS)
                    if (cardsWithDueTime) {
                        expect(cardsWithDueTime.length).toBeGreaterThan(3)

                        let answers = []

                        const expectedNewDue = { // The cards have a current goodInterval of two days
                            FAIL: clock.epochSeconds() + HALF_DAY_IN_SECONDS,
                            HARD: clock.epochSeconds() + ONE_DAY_IN_SECONDS,
                            GOOD: clock.epochSeconds() + TWO_DAYS_IN_SECONDS,
                            EASY: clock.epochSeconds() + (TWO_DAYS_IN_SECONDS * 2)
                        }
                        const expectedNewGoodInterval = {
                            FAIL: ONE_DAY_IN_SECONDS,
                            HARD: TWO_DAYS_IN_SECONDS,
                            GOOD: (TWO_DAYS_IN_SECONDS * 2),
                            EASY: (TWO_DAYS_IN_SECONDS * 4)
                        }
                        const answersToTest = [FAIL, HARD, GOOD, EASY]

                        for (let i = 0; i < 4; i++) {
                            const userSelectedAnswer = answersToTest[i]

                            answers.push(service.answerCard(cardsWithDueTime[i].id, userSelectedAnswer).then(answeredCard => {
                                const card = cardsWithDueTime[i]
                                const originalDue = card.due
                                const newDue = answeredCard.due
                                const newGoodInterval = answeredCard.goodInterval

                                expect(originalDue).toBeGreaterThan(0)
                                expect(newDue).toEqual(expectedNewDue[userSelectedAnswer])
                                expect(newGoodInterval).toEqual(expectedNewGoodInterval[userSelectedAnswer])
                            }))
                        }

                        return Promise.all(answers).then(() => done())
                    }
                })
        })

    })
}