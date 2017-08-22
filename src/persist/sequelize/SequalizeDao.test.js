//@flow
import User from "../../entity/User"
import {CardEntity, CollectionEntity, DeckEntity, SequelizeDao, UserEntity} from "./SequelizeDao"
import {Sequelize} from 'sequelize'
import Collection from "../../entity/Collection"
import Deck from "../../entity/Deck"
import Card from "../../entity/Card"
import {TEST_USER_EMAIL} from "../Dao"

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

        const user = new User(undefined, "blah@somewhere.com")

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
        expect.assertions(11)

        UserEntity.create({
            email: 'someEmail@blah.com'
        }).then((user) => {
            return CollectionEntity.create({
                userId: user.id
            })
        }).then((collection) => {
            return DeckEntity.create({
                name: 'Some Deck',
                collectionId: collection.id
            })
        }).then((deck) => {
            const entity = new Card(undefined, deck.id, 'Question 1?', 'Answer 1.', undefined)
            const entity2 = new Card(undefined, deck.id, 'Question 2?', 'Answer 2.', 20999)
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
                    expect(all[0].due).toEqual(null)
                    expect(all[1].due).toEqual(entity2.due)
                    done()
                })
            })
        })
    })

    it('should be able to create a deck', (done) => {

        expect.assertions(3)

        UserEntity.create({
            email: 'someEmail@blah.com'
        }).then((user) => {
            return CollectionEntity.create({
                userId: user.id
            })
        }).then((collection) => {
            const entity = new Deck(undefined, collection.id, 'Some Deck')

            service.saveDeck(entity).then((entity) => {
                DeckEntity.findAll().then(all => {
                    expect(all.length).toEqual(1)
                    expect(all[0].id).toBeDefined()
                    expect(all[0].collectionId).toEqual(collection.id)
                    done()
                })
            })
        })
    })

    it('should be able to create a collection', (done) => {
        expect.assertions(3)

        UserEntity.create({
            email: 'someEmail@blah.com'
        }).then((user) => {
            const entity = new Collection(undefined, user.id)

            service.saveCollection(entity).then((entity) => {
                CollectionEntity.findAll().then(all => {
                    expect(all.length).toEqual(1)
                    expect(all[0].id).toBeDefined()
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

    it('should be able to delete a collection', (done) => {
        expect.assertions(2)

        loadCollectionData().then(() => {

            UserEntity.findOne().then((entity) => {
                expect(entity).toBeDefined()

                service.deleteCollection(entity.id).then(() => {
                    CollectionEntity.findById(entity.id).then((entity) => {
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
                    expect(user.id).toEqual(entity.id)
                    expect(user.email).toEqual(TEST_USER_EMAIL)
                    done()
                })
            })
        })
    })

    it('should be able to query for a card', (done) => {
        expect.assertions(5)

        loadCollectionData().then(() => {

            CardEntity.findOne().then((entity) => {
                service.findCard(entity.id).then((returned: Card) => {
                    expect(returned.id).toEqual(entity.id)
                    expect(returned.deckId).toEqual(entity.deckId)
                    expect(returned.question).toEqual(entity.question)
                    expect(returned.answer).toEqual(entity.answer)
                    expect(returned.due).toEqual(entity.due)
                    done()
                })
            })
        })
    })

    it('should be able to query for a deck', (done) => {
        expect.assertions(3)

        loadCollectionData().then(() => {

            DeckEntity.findOne().then((entity) => {
                service.findDeck(entity.id).then((returned: Deck) => {
                    expect(returned.id).toEqual(entity.id)
                    expect(returned.name).toEqual(entity.name)
                    expect(returned.collectionId).toEqual(entity.collectionId)
                    done()
                })
            })
        })
    })

    it('should be able to query for a collection', (done) => {
        expect.assertions(2)

        loadCollectionData().then(() => {

            CollectionEntity.findOne().then((entity) => {
                service.findCollection(entity.id).then((returned) => {
                    expect(returned.id).toEqual(entity.id)
                    expect(returned.userId).toEqual(entity.userId)
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

        expect.assertions(5)

        const newQuestion = 'New Question?'
        const newAnswer = 'New Answer'
        const newDue = 39392323

        loadCollectionData()
            .then(() => CardEntity.findOne())
            .then((entity) => {
                const changed = new Card(entity.id, entity.deckId, newQuestion, newAnswer, newDue)

                service.updateCard(changed).then(() => {
                    CardEntity.findById(entity.id).then(updated => {
                        expect(updated.id).toEqual(entity.id)
                        expect(updated.deckId).toEqual(entity.deckId)
                        expect(updated.question).toEqual(newQuestion)
                        expect(updated.answer).toEqual(newAnswer)
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
                const changed = new Deck(entity.id, entity.collectionId, newDeckName)

                service.updateDeck(changed).then(() => {
                    DeckEntity.findById(entity.id).then(updated => {
                        expect(updated.id).toEqual(entity.id)
                        expect(updated.collectionId).toEqual(entity.collectionId)
                        expect(updated.name).toEqual(newDeckName)
                        done()
                    })
                })
            })
    })

    it('should be able to update a collection', (done) => {
        expect.assertions(2)

        const anotherUser = "yoyoyo@somewhereelse.com"

        loadCollectionData()
            .then(() => UserEntity.create({email: anotherUser}))
            .then((newUser) => CollectionEntity.findOne().then((entity) => {
                const changed = new Collection(entity.id, newUser.id)

                service.updateCollection(changed).then(() => {
                    CollectionEntity.findById(entity.id).then(updated => {
                        expect(updated.id).toEqual(entity.id)
                        expect(updated.userId).toEqual(newUser.id)
                        done()
                    })
                })
            }))
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

    it('should be able to find collections by user email', (done) => {
        expect.assertions(1)

        loadCollectionData().then(() => {

            service.findCollectionByUserEmail(TEST_USER_EMAIL).then(collection => {
                expect(collection).toBeDefined()
                done()
            })
        })
    })
})

export const createDao = () => {
    const sequelize = new Sequelize('database', 'username', 'password', {
        host: 'localhost',
        dialect: 'sqlite',

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
        return CollectionEntity.create({
            userId: user.id
        })
    }).then((collection) => {
        return DeckEntity.create({
            name: 'Some Deck',
            collectionId: collection.id
        })
    }).then((deck) => {
        return CardEntity.create({
            question: 'Question 1?',
            answer: 'Answer 1.',
            deckId: deck.id
        })
    })
}