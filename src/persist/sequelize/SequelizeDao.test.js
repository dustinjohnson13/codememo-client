//@flow
import {CardEntity, DeckEntity, SequelizeDao, TemplateEntity, UserEntity} from "./SequelizeDao"
import {Sequelize} from 'sequelize'
import {
    Card,
    Deck,
    DUE_IMMEDIATELY,
    Template,
    Templates,
    templateTypeFromDBId,
    templateTypeToDBId,
    TEST_USER_EMAIL,
    User
} from "../Dao"
import type {PreLoadedIds} from "../Dao.test"
import {testWithDaoImplementation} from "../Dao.test"
import {testServiceWithDaoImplementation} from "../../services/DataService.test"
import {ONE_DAY_IN_SECONDS} from "../../services/APIDomain"

describe('SequelizeDao', () => {

    const createDao = () => {
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

    const loadCollectionData = async (): Promise<PreLoadedIds> => {
        const persistedUser = await UserEntity.create({
            email: TEST_USER_EMAIL
        })
        const persistedDecks = await Promise.all(
            [1, 2, 3, 4].map(i => DeckEntity.create({
                name: `Deck${i}`,
                userId: persistedUser.id
            })))

        const idsFromZero = Array.from({length: 16}, (v, k) => k + 1)
        const persistedTemplates = await Promise.all(idsFromZero.map(id => {
            return TemplateEntity.create({
                deckId: id < 5 ? persistedDecks[0].id : id < 9 ?
                    persistedDecks[1].id : id < 13 ? persistedDecks[2].id : persistedDecks[3].id,
                type: templateTypeToDBId(Templates.FRONT_BACK),
                field1: `Question ${id}?`,
                field2: `Answer ${id}?`
            })
        }))
        const persistedCards = await Promise.all(idsFromZero.map((id, idx) => {
            return CardEntity.create({
                templateId: persistedTemplates[idx].id,
                cardNumber: 1,
                goodInterval: ONE_DAY_IN_SECONDS,
                due: id % 4 === 0 ? DUE_IMMEDIATELY : 1508331802
            })
        }))

        return {
            users: [persistedUser.id.toString()],
            decks: persistedDecks.map(it => it.id.toString()),
            templates: persistedTemplates.map(it => it.id.toString()),
            cards: persistedCards.map(it => it.id.toString())
        }
    }

    function getSequelizeUser(id: string): Promise<User | void> {
        return UserEntity.findById(parseInt(id)).then(entity => entity ? new User(entity.id.toString(),
            entity.email) : undefined)
    }

    function getSequelizeDeck(id: string): Promise<Deck | void> {
        return DeckEntity.findById(parseInt(id)).then(entity => entity ? new Deck(entity.id.toString(),
            entity.userId.toString(), entity.name) : undefined)
    }

    function getSequelizeTemplate(id: string): Promise<Template | void> {
        return TemplateEntity.findById(parseInt(id)).then(entity => entity ? new Template(entity.id.toString(),
            entity.deckId.toString(), templateTypeFromDBId(entity.type), entity.field1, entity.field2) : undefined)
    }

    function getSequelizeCard(id: string): Promise<Card | void> {
        return CardEntity.findById(parseInt(id)).then(entity => entity ? new Card(entity.id.toString(),
            entity.templateId.toString(), entity.cardNumber, entity.goodInterval, entity.due) : undefined)
    }

    testWithDaoImplementation(createDao, loadCollectionData,
        getSequelizeUser, getSequelizeDeck, getSequelizeTemplate, getSequelizeCard)

    testServiceWithDaoImplementation(createDao)
})