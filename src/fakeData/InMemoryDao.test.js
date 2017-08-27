//@flow
import {Card, Deck, DUE_IMMEDIATELY, newDeck, newUser, Template, Templates, TEST_USER_EMAIL, User} from "../persist/Dao"
import type {PreLoadedIds} from "../persist/Dao.test"
import {testWithDaoImplementation} from "../persist/Dao.test"
import {InMemoryDao} from "./InMemoryDao"
import {ONE_DAY_IN_SECONDS} from "../services/APIDomain"
import {testServiceWithDaoImplementation} from "../services/DataService.test"

describe('InMemoryDao', () => {

    const dao = new InMemoryDao()

    const createDao = () => {
        return dao
    }

    const loadCollectionData = async (): Promise<PreLoadedIds> => {
        const persistedUser = await dao.saveUser(newUser(TEST_USER_EMAIL))
        const persistedDecks = await Promise.all(
            [1, 2, 3, 4].map(i => {
                return dao.saveDeck(newDeck(persistedUser.id, `Deck${i}`))
            }))

        const idsFromZero = Array.from({length: 16}, (v, k) => k + 1)
        const persistedTemplates = await Promise.all(idsFromZero.map(id => {
            const deckId = (id < 5 ? persistedDecks[0].id : id < 9 ?
                persistedDecks[1].id : id < 13 ? persistedDecks[2].id : persistedDecks[3].id).toString()

            const entity = new Template(id.toString(), deckId, Templates.FRONT_BACK, `Question ${id}?`, `Answer ${id}?`)

            return dao.saveTemplate(entity)
        }))
        const persistedCards = await Promise.all(idsFromZero.map((id, idx) => {
            const deckId = (id < 5 ? persistedDecks[0].id : id < 9 ?
                persistedDecks[1].id : id < 13 ? persistedDecks[2].id : persistedDecks[3].id).toString()
            const due = id % 4 === 0 ? DUE_IMMEDIATELY : 1508331802

            const card = new Card(id.toString(), persistedTemplates[idx].id, 1, ONE_DAY_IN_SECONDS, due)

            return dao.saveCard(card)
        }))

        return {
            users: [persistedUser.id.toString()],
            decks: persistedDecks.map(it => it.id.toString()),
            templates: persistedTemplates.map(it => it.id.toString()),
            cards: persistedCards.map(it => it.id.toString())
        }
    }

    function getSequelizeUser(id: string): Promise<User | void> {
        return dao.findUser(id)
    }

    function getSequelizeDeck(id: string): Promise<Deck | void> {
        return dao.findDeck(id)
    }

    function getSequelizeTemplate(id: string): Promise<Template | void> {
        return dao.findTemplate(id)
    }

    function getSequelizeCard(id: string): Promise<Card | void> {
        return dao.findCard(id)
    }

    testWithDaoImplementation(createDao, loadCollectionData,
        getSequelizeUser, getSequelizeDeck, getSequelizeTemplate, getSequelizeCard)

    testServiceWithDaoImplementation(createDao)
})