//@flow
import {Sequelize} from 'sequelize'
import type {Dao} from "../Dao"
import {Card, CARD_TABLE, Deck, DECK_TABLE, User, USER_TABLE} from "../Dao"

const modelDefiner = new Sequelize({
        dialect: 'sqlite',
        logging: false
    }
)

export const UserEntity = modelDefiner.define(USER_TABLE, {
    email: {
        type: Sequelize.STRING,
        unique: true
    }
})

export const DeckEntity = modelDefiner.define(DECK_TABLE, {
    userId: {
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
    goodInterval: {
        type: Sequelize.INTEGER
    },
    due: {
        type: Sequelize.INTEGER
    }
})

const hydrateDeck = (entity: DeckEntity) => {
    return new Deck(entity.id.toString(), entity.userId.toString(), entity.name)
}

const hydrateCard = (entity: CardEntity) => {
    return new Card(entity.id.toString(), entity.deckId.toString(), entity.question, entity.answer, entity.goodInterval, entity.due)
}

const hydrateUser = (entity: UserEntity) => {
    return new User(entity.id.toString(), entity.email)
}

export class SequelizeDao implements Dao {

    sequelize: Sequelize

    constructor(sequelize: Sequelize) {
        this.sequelize = sequelize
    }

    init(clearDatabase: boolean): Promise<void> {
        return UserEntity.sync({force: clearDatabase})
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
            goodInterval: card.goodInterval,
            due: card.due
        })
    }

    async updateCard(card: Card): Promise<Card> {
        if (!card.id) {
            throw new Error("Card must have an id.")
        }

        const entity = await CardEntity.findById(card.id)
        await entity.updateAttributes({
            deckId: card.deckId,
            question: card.question,
            answer: card.answer,
            goodInterval: card.goodInterval,
            due: card.due
        })
        return card
    }

    saveDeck(deck: Deck): Promise<Deck> {
        return DeckEntity.create({
            name: deck.name,
            userId: deck.userId
        })
    }

    async updateDeck(deck: Deck): Promise<Deck> {
        if (!deck.id) {
            throw new Error("Deck must have an id.")
        }

        const entity = await DeckEntity.findById(deck.id)
        await entity.updateAttributes({
            userId: deck.userId,
            name: deck.name
        })
        return deck
    }

    deleteUser(id: string): Promise<string> {
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

    findUser(id: string): Promise<User | void> {
        return UserEntity.findById(id).then((entity) => hydrateUser(entity))
    }

    findCard(id: string): Promise<Card | void> {
        return CardEntity.findById(id).then(entity => hydrateCard(entity))
    }

    findDeck(id: string): Promise<Deck | void> {
        return DeckEntity.findById(id).then((entity) => hydrateDeck(entity))
    }

    findDecksByUserId(userId: string): Promise<Array<Deck>> {
        const q = DeckEntity.findAll({
            where: {
                userId: userId
            }
        })
        return q.then(entities => {
            return entities.map(hydrateDeck)
        })
    }

    findCardsByDeckId(deckId: string): Promise<Array<Card>> {
        const q = CardEntity.findAll({
            where: {
                deckId: deckId
            }
        })
        return q.then(entities => entities.map(hydrateCard))
    }

    findUserByEmail(email: string): Promise<User | void> {
        const q = UserEntity.findOne({
            where: {
                email: email
            }
        })
        return q.then(entity => hydrateUser(entity)).catch(() => undefined)
    }
}