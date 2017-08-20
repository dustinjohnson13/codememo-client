//@flow
import User from "../entity/User"

import {Sequelize} from 'sequelize'
import Card from "../entity/Card"
import Deck from "../entity/Deck"
import Collection from "../entity/Collection"
import {CARD_TABLE, COLLECTION_TABLE, DECK_TABLE, USER_TABLE} from "./Dao"

const modelDefiner = new Sequelize({
    dialect: 'sqlite'
})

export const UserEntity = modelDefiner.define(USER_TABLE, {
    email: {
        type: Sequelize.STRING
    }
})

export const CollectionEntity = modelDefiner.define(COLLECTION_TABLE, {
    userId: {
        type: Sequelize.INTEGER
    }
})

export const DeckEntity = modelDefiner.define(DECK_TABLE, {
    collectionId: {
        type: Sequelize.INTEGER
    },
    name: {
        type: Sequelize.STRING
    },
})

export const CardEntity = modelDefiner.define(CARD_TABLE, {
    deckId: {
        type: Sequelize.INTEGER
    },
    question: {
        type: Sequelize.STRING
    },
    answer: {
        type: Sequelize.STRING
    },
    due: {
        type: Sequelize.INTEGER
    }
})

const hydrateDeck = (entity: DeckEntity) => {
    return new Deck(entity.id, entity.collectionId, entity.name)
}

const hydrateCard = (entity: CardEntity) => {
    return new Card(entity.id, entity.deckId, entity.question, entity.answer, entity.due)
}

export class SequelizeDao {

    sequelize: Sequelize

    constructor(sequelize: Sequelize) {
        this.sequelize = sequelize
    }

    init(clearDatabase: boolean): Promise<void> {
        return UserEntity.sync()
            .then(() => CollectionEntity.sync({force: clearDatabase}))
            .then(() => DeckEntity.sync({force: clearDatabase}))
            .then(() => CardEntity.sync({force: clearDatabase}))
    }

    saveUser(user: User): Promise<User> {
        return UserEntity.create({
            email: user.email
        })
    }

    updateUser(user: User): Promise<User> {
        if (!user.id) {
            throw new Error("User must have an id.")
        }

        return UserEntity.findById(user.id).then(entity => {
            entity.updateAttributes({
                email: user.email
            })
        }).then(() => Promise.resolve(user))
    }

    saveCard(card: Card): Promise<Card> {
        return CardEntity.create({
            deckId: card.deckId,
            question: card.question,
            answer: card.answer,
            due: card.due
        })
    }

    updateCard(card: Card): Promise<Card> {
        if (!card.id) {
            throw new Error("Card must have an id.")
        }

        return CardEntity.findById(card.id).then(entity =>
            entity.updateAttributes({
                deckId: card.deckId,
                question: card.question,
                answer: card.answer,
                due: card.due
            })
        ).then(() => Promise.resolve(card))
    }

    saveDeck(deck: Deck): Promise<Deck> {
        return DeckEntity.create({
            name: deck.name,
            collectionId: deck.collectionId
        })
    }

    updateDeck(deck: Deck): Promise<Deck> {
        if (!deck.id) {
            throw new Error("Deck must have an id.")
        }

        return DeckEntity.findById(deck.id).then(entity =>
            entity.updateAttributes({
                collectionId: deck.collectionId,
                name: deck.name
            })
        ).then(() => Promise.resolve(deck))
    }

    saveCollection(collection: Collection): Promise<Collection> {
        return CollectionEntity.create({
            userId: collection.userId
        })
    }

    updateCollection(collection: Collection): Promise<Collection> {
        if (!collection.id) {
            throw new Error("Collection must have an id.")
        }

        return CollectionEntity.findById(collection.id).then(entity =>
            entity.updateAttributes({
                userId: collection.userId
            })
        ).then(() => Promise.resolve(collection))
    }

    deleteUser(id: number): Promise<number> {
        return UserEntity.destroy({
            where: {
                id: id
            }
        })
    }

    deleteCard(id: string): Promise<string> {
        return CardEntity.destroy({
            where: {
                id: id
            }
        })
    }

    deleteDeck(id: string): Promise<string> {
        return DeckEntity.destroy({
            where: {
                id: id
            }
        })
    }

    deleteCollection(id: number): Promise<number> {
        return CollectionEntity.destroy({
            where: {
                id: id
            }
        })
    }

    findUser(id: number): Promise<User> {
        return UserEntity.findById(id).then((entity) => new User(entity.id, entity.email))
    }

    findCard(id: number): Promise<Card> {
        return CardEntity.findById(id).then(entity => hydrateCard(entity))
    }

    findDeck(id: number): Promise<Deck> {
        return DeckEntity.findById(id).then((entity) => hydrateDeck(entity))
    }

    findCollection(id: number): Promise<Collection> {
        return CollectionEntity.findById(id).then((entity) => new Collection(entity.id, entity.userId))
    }

    findDecksByCollectionId(collectionId: number): Promise<Array<Deck>> {
        const q = DeckEntity.findAll({
            where: {
                collectionId: collectionId
            }
        })
        return q.then(entities => {
            return entities.map(hydrateDeck)
        })
    }

    findCardsByDeckId(deckId: number): Promise<Array<Card>> {
        const q = CardEntity.findAll({
            where: {
                deckId: deckId
            }
        })
        return q.then(entities => entities.map(hydrateCard))
    }

    // TODO: This needs to actually respect the email
    findCollectionByUserEmail(email: string): Promise<Collection> {
        return CollectionEntity.findOne()
    }

}