//@flow
import {Sequelize} from 'sequelize'
import type {Dao} from "../Dao"
import {
    Card, CARD_TABLE, Deck, DECK_TABLE, NO_ID, Template, TEMPLATE_TABLE, templateTypeToDBId, User,
    USER_TABLE
} from "../Dao"

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

export const TemplateEntity = modelDefiner.define(TEMPLATE_TABLE, {
    deckId: {
        type: Sequelize.INTEGER
    },
    type: {
        type: Sequelize.INTEGER
    },
    field1: {
        type: Sequelize.STRING
    },
    field2: {
        type: Sequelize.STRING
    }
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

const hydrateDeck = (entity: DeckEntity): Deck | void => {
    return entity ? new Deck(entity.id.toString(), entity.userId.toString(), entity.name) : undefined
}

const hydrateCard = (entity: CardEntity): Card | void => {
    return entity ? new Card(entity.id.toString(), entity.deckId.toString(), entity.question, entity.answer, entity.goodInterval, entity.due) : undefined
}

const hydrateUser = (entity: UserEntity): User | void => {
    return entity ? new User(entity.id.toString(), entity.email) : undefined
}

export class SequelizeDao implements Dao {

    sequelize: Sequelize

    constructor(sequelize: Sequelize) {
        this.sequelize = sequelize
    }

    init(clearDatabase: boolean): Promise<void> {
        return UserEntity.sync({force: clearDatabase})
            .then(() => DeckEntity.sync({force: clearDatabase}))
            .then(() => TemplateEntity.sync({force: clearDatabase}))
            .then(() => CardEntity.sync({force: clearDatabase}))
    }

    saveUser(user: User): Promise<User> {
        return UserEntity.create({
            email: user.email
        })
    }

    updateUser(user: User): Promise<User> {
        if (user.id === NO_ID) {
            throw new Error("Unable to update non-persisted user!")
        }

        return UserEntity.findById(user.id).then(entity => {
            entity.updateAttributes({
                email: user.email
            })
        }).then(() => user)
            .catch(err => {
                throw new Error("Unable to update non-existent user!")
            })
    }

    saveTemplate(entity: Template): Promise<Template> {
        return TemplateEntity.create({
            deckId: entity.deckId,
            type: templateTypeToDBId(entity.type),
            field1: entity.field1,
            field2: entity.field2
        })
    }

    async updateTemplate(template: Template): Promise<Template> {
        if (template.id === NO_ID) {
            throw new Error("Unable to update non-persisted template!")
        }

        try {
            const entity = await TemplateEntity.findById(template.id)
            await entity.updateAttributes({
                deckId: template.deckId,
                type: templateTypeToDBId(template.type),
                field1: template.field1,
                field2: template.field2,
            })
        } catch (e) {
            throw new Error("Unable to update non-existent template!")
        }
        return template
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
        if (card.id === NO_ID) {
            throw new Error("Unable to update non-persisted card!")
        }

        try {
            const entity = await CardEntity.findById(card.id)
            await entity.updateAttributes({
                deckId: card.deckId,
                question: card.question,
                answer: card.answer,
                goodInterval: card.goodInterval,
                due: card.due
            })
        } catch (e) {
            throw new Error("Unable to update non-existent card!")
        }
        return card
    }

    saveDeck(deck: Deck): Promise<Deck> {
        return DeckEntity.create({
            name: deck.name,
            userId: deck.userId
        })
    }

    async updateDeck(deck: Deck): Promise<Deck> {
        if (deck.id === NO_ID) {
            throw new Error("Unable to update non-persisted deck!")
        }

        try {
            const entity = await DeckEntity.findById(deck.id)
            await entity.updateAttributes({
                userId: deck.userId,
                name: deck.name
            })
        } catch (e) {
            throw new Error("Unable to update non-existent deck!")
        }

        return deck
    }

    deleteUser(id: string): Promise<string> {
        return UserEntity.destroy({
            where: {
                id: id
            }
        })
    }

    deleteTemplate(id: string): Promise<string> {
        return TemplateEntity.destroy({
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