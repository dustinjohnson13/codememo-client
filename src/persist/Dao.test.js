//@flow
import type {Dao} from "./Dao"
import {Card, Deck, TEST_USER_EMAIL, User} from "./Dao"
import {DUE_IMMEDIATELY, NO_ID, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS} from "../services/APIDomain"

export type PreLoadedIds = {
    users: Array<string>,
    decks: Array<string>,
    cards: Array<string>
}

describe('Placeholder', () => {
    it('needs this placeholder', () => {
        expect(true).toBeTruthy()
    })
})

export function
testWithDaoImplementation(createDao: () => Dao,
                          loadCollectionData: () => Promise<PreLoadedIds>,
                          getDBUser: (id: string) => Promise<User | void>,
                          getDBDeck: (id: string) => Promise<Deck | void>,
                          getDBCard: (id: string) => Promise<Card | void>) {

    describe('Dao', () => {

        let dao: Dao

        beforeEach(async () => {
            dao = createDao()
            await dao.init(true)
        })

        it('should be able to create a user', async (done) => {
            expect.assertions(5)

            const original = new User(NO_ID, "blah@somewhere.com")

            dao.saveUser(original).then(user => {
                expect(original.id).toEqual(NO_ID)
                expect(user.id).not.toEqual(NO_ID)
                expect(user).not.toBe(original)

                getDBUser(user.id).then(dbUser => {
                    if (dbUser) {
                        expect(dbUser.id).toBeDefined()
                        expect(dbUser.email).toEqual(user.email)
                    }
                    done()
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
            expect.assertions(18)

            const deckId = "1"
            const entity = new Card(NO_ID, deckId, "Question 1?", "Answer 1?", ONE_DAY_IN_SECONDS, DUE_IMMEDIATELY)
            const entity2 = new Card(NO_ID, deckId, "Question 2?", "Answer 2?", ONE_DAY_IN_SECONDS, 20999)
            const entities = [entity, entity2]

            const persist = Promise.all(entities.map(original => dao.saveCard(original)
                .then(entity => {
                    expect(original.id).toEqual(NO_ID)
                    expect(entity.id).not.toEqual(NO_ID)
                    expect(entity).not.toBe(original)

                    return entity
                })))

            let doneChecking = 0
            return persist.then((persisted: Array<Card>) => {

                const originalByQuestion = new Map(entities.map(i => [i.question, i]))

                persisted.forEach((entity, idx) => {

                    expect(entity.id).toBeDefined()

                    getDBCard(entity.id).then((dbCard?: Card) => {
                        if (dbCard) {
                            const original = originalByQuestion.get(dbCard.question)
                            if (original) {
                                expect(dbCard.question).toEqual(original.question)
                                expect(dbCard.answer).toEqual(original.answer)
                                expect(dbCard.goodInterval).toEqual(original.goodInterval)
                                expect(dbCard.due).toEqual(original.due)
                                expect(dbCard.deckId).toEqual(original.deckId)
                            }
                        }

                        if (++doneChecking === 2) {
                            done()
                        }
                    })
                })
            })
        })

        it('should be able to create a deck', (done) => {

            expect.assertions(5)

            const userId = "1"
            const original = new Deck(NO_ID, userId, 'Some Name')

            dao.saveDeck(original).then(entity => {

                expect(original.id).toEqual(NO_ID)
                expect(entity.id).not.toEqual(NO_ID)
                expect(entity).not.toBe(original)

                getDBDeck(entity.id).then((dbDeck?: Deck) => {
                    if (dbDeck) {
                        expect(dbDeck.name).toEqual(entity.name)
                        expect(dbDeck.userId).toEqual(entity.userId)
                    }
                    done()
                })
            })
        })

        it('should be able to delete a user', (done) => {
            expect.assertions(1)

            loadCollectionData().then(preLoadedIds => {

                const id = preLoadedIds.users[0]

                dao.deleteUser(id).then(() => {
                    getDBUser(id).then(result => {
                        expect(result).toBeUndefined()
                        done()
                    })
                })
            })
        })

        it('should be able to delete a card', (done) => {
            expect.assertions(1)

            loadCollectionData().then(preLoadedIds => {

                const id = preLoadedIds.cards[0]

                dao.deleteCard(id).then(() => {
                    getDBCard(id).then(result => {
                        expect(result).toBeUndefined()
                        done()
                    })
                })
            })
        })

        it('should be able to delete a deck', (done) => {
            expect.assertions(1)

            loadCollectionData().then(preLoadedIds => {

                const id = preLoadedIds.decks[0]

                dao.deleteDeck(id).then((id) => {
                    getDBDeck(id).then(result => {
                        expect(result).toBeUndefined()
                        done()
                    })
                })
            })
        })

        it('should be able to query for a user', (done) => {
            expect.assertions(2)

            loadCollectionData().then(preLoadedIds => {

                const id = preLoadedIds.users[0]

                dao.findUser(id).then((user) => {
                    if (user) {
                        expect(user.id).toEqual(id)
                        expect(user.email).toEqual("someone@blah.com")
                    }
                    done()
                })
            })
        })

        it('should be able to query for a card', (done) => {
            expect.assertions(5)

            loadCollectionData().then(preLoadedIds => {

                const id = preLoadedIds.cards[2]

                dao.findCard(id).then((card) => {
                    if (card) {
                        expect(card.id).toEqual(id)
                        expect(card.deckId).toEqual(preLoadedIds.decks[0])
                        expect(card.question).toEqual("Question 3?")
                        expect(card.answer).toEqual("Answer 3?")
                        expect(card.due).toEqual(1508331802)
                    }
                    done()
                })
            })
        })

        it('should be able to query for a deck', (done) => {
            expect.assertions(3)

            loadCollectionData().then(preLoadedIds => {

                const id = preLoadedIds.decks[2]

                dao.findDeck(id).then((deck) => {
                    if (deck) {
                        expect(deck.id).toEqual(id)
                        expect(deck.userId).toEqual(preLoadedIds.users[0])
                        expect(deck.name).toEqual("Deck3")
                    }
                    done()
                })
            })
        })

        it('should be able to update a user', (done) => {
            expect.assertions(1)

            loadCollectionData().then(preLoadedIds => {

                const id = preLoadedIds.users[0]
                const newEmail = "yoyoyo@somewhereelse.com"

                dao.updateUser(new User(id, newEmail)).then((user) => {
                    getDBUser(user.id).then(dbUser => {
                        if (dbUser) {
                            expect(dbUser.email).toEqual(newEmail)
                        }
                        done()
                    })
                })
            })
        })

        it('should be able to update a card', (done) => {

            expect.assertions(5)

            loadCollectionData().then(preLoadedIds => {

                const id = preLoadedIds.cards[2]
                const newDeckId = "newDeckId"
                const newQuestion = "newQuestion?"
                const newAnswer = "newAnswer?"
                const newGoodInterval = TWO_DAYS_IN_SECONDS
                const newDue = 12

                dao.updateCard(new Card(id, newDeckId, newQuestion, newAnswer, TWO_DAYS_IN_SECONDS, newDue)).then((updated) => {
                    getDBCard(id).then(dbCard => {
                        if (dbCard) {
                            expect(dbCard.deckId).toEqual(newDeckId)
                            expect(dbCard.question).toEqual(newQuestion)
                            expect(dbCard.answer).toEqual(newAnswer)
                            expect(dbCard.goodInterval).toEqual(newGoodInterval)
                            expect(dbCard.due).toEqual(newDue)
                        }
                        done()
                    })
                })
            })
        })

        it('should be able to update a deck', (done) => {
            expect.assertions(2)

            loadCollectionData().then(preLoadedIds => {

                const id = preLoadedIds.decks[1]
                const newUserId = "another-user"
                const newName = "SomeNewName"

                dao.updateDeck(new Deck(id, newUserId, newName)).then((updated) => {
                    getDBDeck(id).then(deck => {
                        if (deck) {
                            expect(deck.userId).toEqual(newUserId)
                            expect(deck.name).toEqual(newName)
                        }
                        done()
                    })
                })
            })
        })

        it('should be able to find decks by user id', (done) => {
            expect.assertions(3)

            loadCollectionData().then(preLoadedIds => {

                const id = preLoadedIds.users[0]

                dao.findDecksByUserId(id).then(decks => {
                    expect(decks.length).toEqual(4)
                    expect(decks.map(it => it.id).sort()).toEqual(preLoadedIds.decks.sort())
                    expect(decks.map(it => it.name).sort()).toEqual([
                        "Deck1", "Deck2", "Deck3", "Deck4",
                    ].sort())
                    done()
                })
            })
        })

        it('should be able to find cards by deck id', (done) => {
            expect.assertions(3)

            loadCollectionData().then(preLoadedIds => {

                const id = preLoadedIds.decks[0]

                dao.findCardsByDeckId(id).then(cards => {
                    expect(cards.length).toEqual(4)
                    expect(cards.map(it => it.id)).toEqual(preLoadedIds.cards.slice(0, 4))
                    expect(cards.map(it => it.question)).toEqual([
                        "Question 1?", "Question 2?", "Question 3?", "Question 4?",
                    ])
                    done()
                })
            })
        })

        it('should be able to find user by email', (done) => {
            expect.assertions(1)

            loadCollectionData().then(preLoadedIds => {

                dao.findUserByEmail(TEST_USER_EMAIL).then(user => {
                    if (user) {
                        expect(user.email).toEqual(TEST_USER_EMAIL)
                    }
                    done()
                })
            })
        })
    })
}