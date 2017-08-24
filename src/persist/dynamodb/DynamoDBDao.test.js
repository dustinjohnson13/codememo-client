//@flow
import User from "../../entity/User"
import Deck from "../../entity/Deck"
import Card from "../../entity/Card"
import {
    ACCESS_KEY_ID,
    DYNAMODB_TEST_TIMEOUT,
    loadCollectionData,
    REGION,
    SECRET_ACCESS_KEY,
    startAndLoadData,
    stop
} from "./DynamoDBHelper"
import DynamoDBDao from "./DynamoDBDao"
import {CARD_TABLE, DECK_TABLE, TEST_USER_EMAIL, USER_TABLE} from "../Dao"
import {ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS} from "../../services/APIDomain"

const AWS = require("aws-sdk")

describe('DynamoDBDao', () => {

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

    beforeEach(async () => {
        await dao.init(true)
    })

    it('should be able to list tables', (done) => {
        expect.assertions(1)

        dao.listTables().then((tables) => {
            expect(tables).toEqual(["card", "deck", "user"])
            done()
        })
    })

    it('should be able to create a user', (done) => {
        expect.assertions(3)

        const user = new User(undefined, "blah@somewhere.com")

        dao.saveUser(user).then((user) => {
            expect(user.id).toBeDefined()

            const docClient = new AWS.DynamoDB.DocumentClient()

            const params = {
                TableName: USER_TABLE,
                Key: {
                    "id": user.id
                }
            }

            docClient.get(params, function (err, data) {
                if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2))
                } else {
                    expect(data.Item.id).toBeDefined()
                    expect(data.Item.email).toEqual(user.email)
                    done()
                }
            })
        })
    })

    // it('should not be able to create multiple users with the same email', (done) => {
    //     expect.assertions(2)
    //
    //     const email = "blah@somewhere.com"
    //     const user = new User(undefined, email)
    //
    //     return dao.saveUser(user)
    //         .then((user) => expect(user.id).toBeDefined())
    //         .then(() => dao.saveUser(new User(undefined, email)))
    //         .catch((err) => {
    //             expect(err).toEqual(`User blah@somewhere.com already exists.`)
    //             done()
    //         })
    // })

    it('should be able to create a card', (done) => {
        expect.assertions(12)

        const entity = new Card(undefined, "ff279d7e-8413-11e7-bb31-be2e44b06b34", "Question 1?", "Answer 1?", ONE_DAY_IN_SECONDS, undefined)
        const entity2 = new Card(undefined, "ff279d7e-8413-11e7-bb31-be2e44b06b34", "Question 2?", "Answer 2?", ONE_DAY_IN_SECONDS, 20999)
        const entities = [entity, entity2]

        const persist = Promise.all(entities.map((card) => dao.saveCard(card)))

        let doneChecking = 0
        return persist.then((persisted: Array<Card>) => {

            const originalById = new Map(entities.map((i) => [i.id, i]))

            persisted.forEach((entity, idx) => {

                expect(entity.id).toBeDefined()

                const docClient = new AWS.DynamoDB.DocumentClient()

                const params = {
                    TableName: CARD_TABLE,
                    Key: {
                        "id": entity.id
                    }
                }

                docClient.get(params, function (err, data) {
                    if (err) {
                        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2))
                    } else {
                        const original = originalById.get(data.Item.id)
                        if (original) {
                            expect(data.Item.q).toEqual(original.question)
                            expect(data.Item.a).toEqual(original.answer)
                            expect(data.Item.g).toEqual(original.goodInterval)
                            expect(data.Item.d).toEqual(original.due)
                            expect(data.Item.dId).toEqual(original.deckId)
                        }

                        if (++doneChecking === 2) {
                            done()
                        }
                    }
                })
            })
        })
    })

    it('should be able to create a deck', (done) => {

        expect.assertions(3)

        const entity = new Deck(undefined, "d1eda90c-8413-11e7-bb31-be2e44b06b34", 'Some Name')

        dao.saveDeck(entity).then((entity) => {

            expect(entity.id).toBeDefined()

            const docClient = new AWS.DynamoDB.DocumentClient()

            const params = {
                TableName: DECK_TABLE,
                Key: {
                    "id": entity.id
                }
            }

            docClient.get(params, function (err, data) {
                if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2))
                } else {
                    expect(data.Item.n).toEqual(entity.name)
                    expect(data.Item.uId).toEqual(entity.userId)
                    done()
                }
            })
        })
    })

    it('should be able to delete a user', (done) => {
        expect.assertions(1)

        loadCollectionData(port).then(() => {

            const id = "d1eda90c-8413-11e7-bb31-be2e44b06b34"

            dao.deleteUser(id).then((user) => {

                const docClient = new AWS.DynamoDB.DocumentClient()

                const params = {
                    TableName: USER_TABLE,
                    Key: {
                        "id": id
                    }
                }

                docClient.get(params, function (err, data) {
                    if (err) {
                        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2))
                    } else {
                        expect(data.Item).toBeUndefined()
                        done()
                    }
                })
            })
        })
    })

    it('should be able to delete a card', (done) => {
        expect.assertions(1)

        loadCollectionData(port).then(() => {

            const id = "7c7a2ddc-8414-11e7-bb31-be2e44b06b34"

            dao.deleteCard(id).then((id) => {

                const docClient = new AWS.DynamoDB.DocumentClient()

                const params = {
                    TableName: CARD_TABLE,
                    Key: {
                        "id": id
                    }
                }

                docClient.get(params, function (err, data) {
                    if (err) {
                        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2))
                    } else {
                        expect(data.Item).toBeUndefined()
                        done()
                    }
                })
            })
        })
    })

    it('should be able to delete a deck', (done) => {
        expect.assertions(1)

        loadCollectionData(port).then(() => {

            const id = "ff279d7e-8413-11e7-bb31-be2e44b06b34"

            dao.deleteDeck(id).then((id) => {

                const docClient = new AWS.DynamoDB.DocumentClient()

                const params = {
                    TableName: DECK_TABLE,
                    Key: {
                        "id": id
                    }
                }

                docClient.get(params, function (err, data) {
                    if (err) {
                        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2))
                    } else {
                        expect(data.Item).toBeUndefined()
                        done()
                    }
                })
            })
        })
    })

    it('should be able to query for a user', (done) => {
        expect.assertions(2)

        loadCollectionData(port).then(() => {

            const id = "d1eda90c-8413-11e7-bb31-be2e44b06b34"

            dao.findUser(id).then((user) => {

                expect(user.id).toEqual(id)
                expect(user.email).toEqual("someone@blah.com")
                done()
            })
        })
    })

    it('should be able to query for a card', (done) => {
        expect.assertions(5)

        loadCollectionData(port).then(() => {

            const id = "7c7a2ddc-8414-11e7-bb31-be2e44b06b34"

            dao.findCard(id).then((card) => {
                expect(card.id).toEqual(id)
                expect(card.deckId).toEqual("ff2799fa-8413-11e7-bb31-be2e44b06b34")
                expect(card.question).toEqual("Question 3?")
                expect(card.answer).toEqual("Answer 3?")
                expect(card.due).toEqual(1508331802)
                done()
            })
        })
    })

    it('should be able to query for a deck', (done) => {
        expect.assertions(3)

        loadCollectionData(port).then(() => {

            const id = "ff279d7e-8413-11e7-bb31-be2e44b06b34"

            dao.findDeck(id).then((deck) => {

                expect(deck.id).toEqual(id)
                expect(deck.userId).toEqual("d1eda90c-8413-11e7-bb31-be2e44b06b34")
                expect(deck.name).toEqual("Deck2")
                done()
            })
        })
    })

    it('should be able to update a user', (done) => {
        expect.assertions(1)

        loadCollectionData(port).then(() => {

            const id = "d1eda90c-8413-11e7-bb31-be2e44b06b34"
            const newEmail = "yoyoyo@somewhereelse.com"

            dao.updateUser(new User(id, newEmail)).then((user) => {

                const docClient = new AWS.DynamoDB.DocumentClient()

                const params = {
                    TableName: USER_TABLE,
                    Key: {
                        "id": id
                    }
                }

                docClient.get(params, function (err, data) {
                    if (err) {
                        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2))
                    } else {
                        expect(data.Item.email).toEqual(newEmail)
                        done()
                    }
                })
            })
        })
    })

    it('should be able to update a card', (done) => {

        expect.assertions(5)

        loadCollectionData(port).then(() => {

            const id = "7c7a2ddc-8414-11e7-bb31-be2e44b06b34"
            const newDeckId = "newDeckId"
            const newQuestion = "newQuestion?"
            const newAnswer = "newAnswer?"
            const newGoodInterval = TWO_DAYS_IN_SECONDS
            const newDue = 12

            dao.updateCard(new Card(id, newDeckId, newQuestion, newAnswer, TWO_DAYS_IN_SECONDS, newDue)).then((updated) => {

                const docClient = new AWS.DynamoDB.DocumentClient()

                const params = {
                    TableName: CARD_TABLE,
                    Key: {
                        "id": id
                    }
                }

                docClient.get(params, function (err, data) {
                    if (err) {
                        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2))
                    } else {
                        expect(data.Item.dId).toEqual(newDeckId)
                        expect(data.Item.q).toEqual(newQuestion)
                        expect(data.Item.a).toEqual(newAnswer)
                        expect(data.Item.g).toEqual(newGoodInterval)
                        expect(data.Item.d).toEqual(newDue)
                        done()
                    }
                })
            })
        })
    })

    it('should be able to update a deck', (done) => {
        expect.assertions(2)

        loadCollectionData(port).then(() => {

            const id = "ff279d7e-8413-11e7-bb31-be2e44b06b34"
            const newUserId = "another-user"
            const newName = "SomeNewName"

            dao.updateDeck(new Deck(id, newUserId, newName)).then((updated) => {

                const docClient = new AWS.DynamoDB.DocumentClient()

                const params = {
                    TableName: DECK_TABLE,
                    Key: {
                        "id": id
                    }
                }

                docClient.get(params, function (err, data) {
                    if (err) {
                        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2))
                    } else {
                        expect(data.Item.uId).toEqual(newUserId)
                        expect(data.Item.n).toEqual(newName)
                        done()
                    }
                })
            })
        })
    })

    it('should be able to find decks by user id', (done) => {
        expect.assertions(3)

        loadCollectionData(port).then(() => {

            const id = "d1eda90c-8413-11e7-bb31-be2e44b06b34"

            dao.findDecksByUserId(id).then(decks => {
                expect(decks.length).toEqual(4)
                expect(decks.map(it => it.id)).toEqual([
                    "ff2799fa-8413-11e7-bb31-be2e44b06b34",
                    "ff279e8c-8413-11e7-bb31-be2e44b06b34",
                    "ff279d7e-8413-11e7-bb31-be2e44b06b34",
                    "ff27a03a-8413-11e7-bb31-be2e44b06b34"
                ])
                expect(decks.map(it => it.name)).toEqual([
                    "Deck1", "Deck3", "Deck2", "Deck4",
                ])
                done()
            })
        })
    })

    it('should be able to find cards by deck id', (done) => {
        expect.assertions(3)

        loadCollectionData(port).then(() => {

            const id = "ff2799fa-8413-11e7-bb31-be2e44b06b34"

            dao.findCardsByDeckId(id).then(cards => {
                expect(cards.length).toEqual(4)
                expect(cards.map(it => it.id)).toEqual([
                    "7c7a263e-8414-11e7-bb31-be2e44b06b34",
                    "7c7a2c92-8414-11e7-bb31-be2e44b06b34",
                    "7c7a2ddc-8414-11e7-bb31-be2e44b06b34",
                    "7c7a2ef4-8414-11e7-bb31-be2e44b06b34"
                ])
                expect(cards.map(it => it.question)).toEqual([
                    "Question 1?", "Question 2?", "Question 3?", "Question 4?",
                ])
                done()
            })
        })
    })

    it('should be able to find user by email', (done) => {
        expect.assertions(1)

        loadCollectionData(port).then(() => {

            dao.findUserByEmail(TEST_USER_EMAIL).then(user => {
                if (user) {
                    expect(user.email).toEqual(TEST_USER_EMAIL)
                }
                done()
            })
        })
    })
})