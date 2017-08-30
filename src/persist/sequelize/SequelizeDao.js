//@flow
import {Model, Sequelize} from 'sequelize'
import type {Dao} from "../Dao"
import {
    answerTypeFromDBId,
    answerTypeToDBId,
    Card,
    CARD_TABLE,
    Deck,
    DECK_TABLE,
    formatTypeFromDBId,
    formatTypeToDBId,
    NO_ID,
    Review,
    REVIEW_TABLE,
    Template,
    TEMPLATE_TABLE,
    templateTypeFromDBId,
    templateTypeToDBId,
    User,
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
    format: {
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
    templateId: {
        type: Sequelize.INTEGER
    },
    cardNumber: {
        type: Sequelize.INTEGER
    },
    goodInterval: {
        type: Sequelize.INTEGER
    },
    due: {
        type: Sequelize.INTEGER
    }
})

export const ReviewEntity = modelDefiner.define(REVIEW_TABLE, {
    cardId: {
        type: Sequelize.INTEGER
    },
    startTime: {
        type: Sequelize.INTEGER
    },
    endTime: {
        type: Sequelize.INTEGER
    },
    answer: {
        type: Sequelize.INTEGER
    }
})

const hydrateDeck = (entity: DeckEntity): Deck | void => {
    return entity ? new Deck(entity.id.toString(), entity.userId.toString(), entity.name) : undefined
}

const hydrateTemplate = (entity: TemplateEntity): Template | void => {
    return entity ? new Template(entity.id.toString(), entity.deckId.toString(), templateTypeFromDBId(entity.type),
        formatTypeFromDBId(entity.format), entity.field1, entity.field2) : undefined
}

const hydrateCard = (entity: CardEntity): Card | void => {
    return entity ? new Card(entity.id.toString(), entity.templateId.toString(), entity.cardNumber, entity.goodInterval, entity.due) : undefined
}

const hydrateUser = (entity: UserEntity): User | void => {
    return entity ? new User(entity.id.toString(), entity.email) : undefined
}

const hydrateReview = (entity: ReviewEntity): Review | void => {
    return entity ? new Review(entity.id.toString(), entity.cardId.toString(), entity.startTime, entity.endTime, answerTypeFromDBId(entity.answer)) : undefined
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
            .then(() => ReviewEntity.sync({force: clearDatabase}))
    }

    saveUser(user: User): Promise<User> {
        return UserEntity.create({
            email: user.email
        })
    }

    updateUser(user: User): Promise<User> {
        return this.updateEntity(user.id, USER_TABLE, user, UserEntity, {
            email: user.email
        })
    }

    saveTemplate(entity: Template): Promise<Template> {
        return TemplateEntity.create({
            deckId: entity.deckId,
            type: templateTypeToDBId(entity.type),
            format: formatTypeToDBId(entity.format),
            field1: entity.field1,
            field2: entity.field2
        })
    }

    async updateTemplate(template: Template): Promise<Template> {
        return this.updateEntity(template.id, TEMPLATE_TABLE, template, TemplateEntity, {
            deckId: template.deckId,
            type: templateTypeToDBId(template.type),
            format: formatTypeToDBId(template.format),
            field1: template.field1,
            field2: template.field2,
        })
    }

    saveCard(card: Card): Promise<Card> {
        return CardEntity.create({
            templateId: card.templateId,
            cardNumber: card.cardNumber,
            goodInterval: card.goodInterval,
            due: card.due
        })
    }

    async updateCard(card: Card): Promise<Card> {
        return this.updateEntity(card.id, CARD_TABLE, card, CardEntity, {
            templateId: card.templateId,
            cardNumber: card.cardNumber,
            goodInterval: card.goodInterval,
            due: card.due
        })
    }

    saveDeck(deck: Deck): Promise<Deck> {
        return DeckEntity.create({
            name: deck.name,
            userId: deck.userId
        })
    }

    async updateDeck(deck: Deck): Promise<Deck> {
        return this.updateEntity(deck.id, DECK_TABLE, deck, DeckEntity, {
            userId: deck.userId,
            name: deck.name
        })
    }

    async updateEntity<T>(id: string, type: string, entity: T, model: Model, updates: { [string]: string | number }): Promise<T> {
        if (id === NO_ID) {
            throw new Error(`Unable to update non-persisted ${type}!`)
        }

        try {
            const entity = await model.findById(id)
            await entity.updateAttributes(updates)
        } catch (e) {
            throw new Error(`Unable to update non-existent ${type}!`)
        }

        return entity
    }

    saveReview(review: Review): Promise<Review> {
        return ReviewEntity.create({
            cardId: review.cardId,
            startTime: review.startTime,
            endTime: review.endTime,
            answer: answerTypeToDBId(review.answer)
        })
    }

    async updateReview(review: Review): Promise<Review> {
        if (review.id === NO_ID) {
            throw new Error("Unable to update non-persisted review!")
        }

        try {
            const entity = await ReviewEntity.findById(review.id)
            await entity.updateAttributes({
                cardId: review.cardId,
                startTime: review.startTime,
                endTime: review.endTime,
                answer: answerTypeToDBId(review.answer)
            })
        } catch (e) {
            throw new Error("Unable to update non-existent review!")
        }

        return review
    }

    deleteUser(id: string): Promise<string> {
        return this.deleteEntity(id, UserEntity)
    }

    deleteTemplate(id: string): Promise<string> {
        return this.deleteEntity(id, TemplateEntity)
    }

    deleteCard(id: string): Promise<string> {
        return this.deleteEntity(id, CardEntity)
    }

    deleteDeck(id: string): Promise<string> {
        return this.deleteEntity(id, DeckEntity)
    }

    deleteReview(id: string): Promise<string> {
        return this.deleteEntity(id, ReviewEntity)
    }

    deleteEntity(id: string, model: Model): Promise<string> {
        return model.destroy({
            where: {
                id: id
            }
        })
    }

    findUser(id: string): Promise<User | void> {
        return UserEntity.findById(id).then((entity) => hydrateUser(entity))
    }

    findTemplate(id: string): Promise<Template | void> {
        return TemplateEntity.findById(id).then(entity => hydrateTemplate(entity))
    }

    findCard(id: string): Promise<Card | void> {
        return CardEntity.findById(id).then(entity => hydrateCard(entity))
    }

    findDeck(id: string): Promise<Deck | void> {
        return DeckEntity.findById(id).then((entity) => hydrateDeck(entity))
    }

    findReview(id: string): Promise<Review | void> {
        return ReviewEntity.findById(id).then((entity) => hydrateReview(entity))
    }

    async findReviewsByCardId(cardId: string): Promise<Array<Review>> {
        const q = ReviewEntity.findAll({
            where: {
                cardId: cardId
            }
        })
        return q.then(entities => entities.map(hydrateReview))
    }

    findDecksByUserId(userId: string): Promise<Array<Deck>> {
        const q = DeckEntity.findAll({
            where: {
                userId: userId
            }
        })
        return q.then(entities => entities.map(hydrateDeck))
    }

    async findCardsByDeckId(deckId: string): Promise<Array<Card>> {
        const templates = await TemplateEntity.findAll({
            where: {
                deckId: deckId
            }
        })

        const templateIds = templates.map(it => it.id)

        const entities = await CardEntity.findAll({
            where: {
                templateId: {
                    $in: templateIds
                }
            }
        })
        return entities.map(hydrateCard)
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