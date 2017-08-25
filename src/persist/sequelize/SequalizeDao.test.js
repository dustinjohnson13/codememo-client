//@flow
import {CardEntity, DeckEntity, SequelizeDao, UserEntity} from "./SequelizeDao"
import {Sequelize} from 'sequelize'
import {Card, Deck, TEST_USER_EMAIL, User} from "../Dao"
import {DUE_IMMEDIATELY, NO_ID, ONE_DAY_IN_SECONDS, TWO_DAYS_IN_SECONDS} from "../../services/APIDomain"

describe('SequelizeDao', () => {

    let service

    beforeEach(async () => {
        service = createDao()

        await service.init(true).catch((err) => {
            console.log("Error!")
            throw err
        })
    })

    it('should be able to create a user', (done) => {
        expect.assertions(3)

        const user = new User(NO_ID, "blah@somewhere.com")

        service.saveUser(user).then((user) => {
            UserEntity.findAll().then(users => {
                expect(users.length).toEqual(1)
                expect(users[0].id).toBeDefined()
                expect(users[0].email).toEqual(user.email)
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
    //     return service.saveUser(user)
    //         .then((user) => expect(user.id).toBeDefined())
    //         .then(() => service.saveUser(new User(undefined, email)))
    //         .catch((err) => {
    //             expect(err).toEqual(`User blah@somewhere.com already exists.`)
    //             done()
    //         })
    // })

    it('should be able to create a card', (done) => {
        expect.assertions(13)

        UserEntity.create({
            email: 'someEmail@blah.com'
        }).then((user) => {
            return DeckEntity.create({
                name: 'Some Deck',
                userId: user.id
            })
        }).then((deck) => {
            const entity = new Card(NO_ID, deck.id, 'Question 1?', 'Answer 1.', ONE_DAY_IN_SECONDS, DUE_IMMEDIATELY)
            const entity2 = new Card(NO_ID, deck.id, 'Question 2?', 'Answer 2.', ONE_DAY_IN_SECONDS, 20999)
            const entities = [entity, entity2]
            const persist = Promise.all(entities.map((card) => service.saveCard(card)))

            persist.then((persisted) => {
                CardEntity.findAll().then(all => {
                    expect(all.length).toEqual(2)
                    expect(all[0].id).toBeDefined()
                    expect(all[1].id).toBeDefined()
                    expect(all[0].deckId).toEqual(deck.id)
                    expect(all[1].deckId).toEqual(deck.id)
                    expect(all[0].question).toEqual(entity.question)
                    expect(all[1].question).toEqual(entity2.question)
                    expect(all[0].answer).toEqual(entity.answer)
                    expect(all[1].answer).toEqual(entity2.answer)
                    expect(all[0].goodInterval).toEqual(entity.goodInterval)
                    expect(all[1].goodInterval).toEqual(entity.goodInterval)
                    expect(all[0].due).toEqual(DUE_IMMEDIATELY)
                    expect(all[1].due).toEqual(entity2.due)
                    done()
                })
            })
        })
    })

    it('should be able to create a deck', (done) => {

        expect.assertions(4)

        UserEntity.create({
            email: 'someEmail@blah.com'
        }).then((user) => {
            const entity = new Deck(NO_ID, user.id, 'Some Deck')

            service.saveDeck(entity).then((entity) => {
                DeckEntity.findAll().then(all => {
                    expect(all.length).toEqual(1)
                    expect(all[0].id).toBeDefined()
                    expect(all[0].name).toEqual('Some Deck')
                    expect(all[0].userId).toEqual(user.id)
                    done()
                })
            })
        })
    })

    it('should be able to delete a user', (done) => {
        expect.assertions(2)

        loadCollectionData().then(() => {

            UserEntity.findOne().then((entity) => {
                expect(entity).toBeDefined()

                service.deleteUser(entity.id).then(() => {
                    UserEntity.findById(entity.id).then((entity) => {
                        expect(entity).toBeNull()
                        done()
                    })
                })
            })
        })
    })

    it('should be able to delete a card', (done) => {
        expect.assertions(2)

        loadCollectionData().then(() => {
            CardEntity.findOne().then((entity) => {
                expect(entity).toBeDefined()

                service.deleteCard(entity.id).then(() => {
                    CardEntity.findById(entity.id).then((entity) => {
                        expect(entity).toBeNull()
                        done()
                    })
                })
            })
        })
    })

    it('should be able to delete a deck', (done) => {
        expect.assertions(2)

        loadCollectionData().then(() => {

            DeckEntity.findOne().then((entity) => {
                expect(entity).toBeDefined()

                service.deleteDeck(entity.id).then(() => {
                    DeckEntity.findById(entity.id).then((entity) => {
                        expect(entity).toBeNull()
                        done()
                    })
                })
            })
        })
    })

    it('should be able to query for a user', (done) => {
        expect.assertions(2)

        loadCollectionData().then(() => {

            UserEntity.findOne().then((entity) => {
                service.findUser(entity.id).then((user) => {
                    if (user) {
                        expect(user.id).toEqual(entity.id)
                        expect(user.email).toEqual(TEST_USER_EMAIL)
                    }
                    done()
                })
            })
        })
    })

    it('should be able to query for a card', (done) => {
        expect.assertions(5)

        loadCollectionData().then(() => {

            CardEntity.findOne().then((entity) => {
                service.findCard(entity.id).then(returned => {
                    if (returned) {
                        expect(returned.id).toEqual(entity.id)
                        expect(returned.deckId).toEqual(entity.deckId)
                        expect(returned.question).toEqual(entity.question)
                        expect(returned.answer).toEqual(entity.answer)
                        expect(returned.due).toEqual(entity.due)
                    }
                    done()
                })
            })
        })
    })

    it('should be able to query for a deck', (done) => {
        expect.assertions(3)

        loadCollectionData().then(() => {

            DeckEntity.findOne().then((entity) => {
                service.findDeck(entity.id).then(returned => {
                    if (returned) {
                        expect(returned.id).toEqual(entity.id)
                        expect(returned.name).toEqual(entity.name)
                        expect(returned.userId).toEqual(entity.userId)
                    }
                    done()
                })
            })
        })
    })

    it('should be able to update a user', (done) => {
        expect.assertions(2)

        const newEmail = "yoyoyo@somewhereelse.com"

        loadCollectionData().then(() => {

            UserEntity.findOne().then((entity) => {
                const changed = new User(entity.id, newEmail)

                service.updateUser(changed).then(() => {
                    UserEntity.findById(entity.id).then(updated => {
                        expect(updated.id).toEqual(entity.id)
                        expect(updated.email).toEqual(newEmail)
                        done()
                    })
                })
            })
        })
    })

    it('should be able to update a card', (done) => {

        expect.assertions(6)

        const newQuestion = 'New Question?'
        const newAnswer = 'New Answer'
        const newGoodInterval = TWO_DAYS_IN_SECONDS
        const newDue = 39392323

        loadCollectionData()
            .then(() => CardEntity.findOne())
            .then((entity) => {
                const changed = new Card(entity.id, entity.deckId, newQuestion, newAnswer, newGoodInterval, newDue)

                service.updateCard(changed).then(() => {
                    CardEntity.findById(entity.id).then(updated => {
                        expect(updated.id).toEqual(entity.id)
                        expect(updated.deckId).toEqual(entity.deckId)
                        expect(updated.question).toEqual(newQuestion)
                        expect(updated.answer).toEqual(newAnswer)
                        expect(updated.goodInterval).toEqual(newGoodInterval)
                        expect(updated.due).toEqual(newDue)
                        done()
                    })
                })
            })
    })

    it('should be able to update a deck', (done) => {

        expect.assertions(3)

        const newDeckName = 'New Deck Name'

        loadCollectionData()
            .then(() => DeckEntity.findOne())
            .then((entity) => {
                const changed = new Deck(entity.id, entity.userId, newDeckName)

                service.updateDeck(changed).then(() => {
                    DeckEntity.findById(entity.id).then(updated => {
                        expect(updated.id).toEqual(entity.id)
                        expect(updated.userId).toEqual(entity.userId)
                        expect(updated.name).toEqual(newDeckName)
                        done()
                    })
                })
            })
    })

    it('should be able to find user by email', (done) => {
        expect.assertions(1)

        loadCollectionData().then(() => {

            service.findUserByEmail(TEST_USER_EMAIL).then(user => {
                if (user) {
                    expect(user.email).toEqual(TEST_USER_EMAIL)
                }
                done()
            })
        })
    })
})

export const createDao = () => {
    const sequelize = new Sequelize({
        host: 'localhost',
        dialect: 'sqlite',
        logging: false,

        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },

        // SQLite only
        storage: ':memory:'
    })

    return new SequelizeDao(sequelize)
}

export const loadCollectionData = () => {
    return UserEntity.create({
        email: TEST_USER_EMAIL
    }).then((user) => {
        return DeckEntity.create({
            name: 'Some Deck',
            userId: user.id
        })
    }).then((deck) => {
        return CardEntity.create({
            question: 'Question 1?',
            answer: 'Answer 1.',
            deckId: deck.id
        })
    })
}