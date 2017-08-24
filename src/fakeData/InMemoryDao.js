//@flow
import type {Clock} from "../services/APIDomain"
import type {Dao} from "../persist/Dao"
import User from "../entity/User"
import Collection from "../entity/Collection"
import Deck from "../entity/Deck"
import Card from "../entity/Card"

class FrozenClock implements Clock {
    epochSeconds(): number {
        return 1
    }
}

export class InMemoryDao implements Dao {
    clock: Clock
    users: Array<User> = []
    collections: Array<Collection> = []
    decks: Array<Deck> = []
    cards: Array<Card> = []
    idCounter: number

    constructor(clock: Clock | void) {
        this.clock = (clock) ? clock : new FrozenClock()
        this.idCounter = 1
    }

    saveUser(user: User): Promise<User> {
        return this.saveEntity(user, this.users)
    }

    updateUser(user: User): Promise<User> {
        this.users = this.updateEntity(user, this.users)
        return Promise.resolve(user)
    }

    saveCard(card: Card): Promise<Card> {
        return this.saveEntity(card, this.cards)
    }

    updateCard(card: Card): Promise<Card> {
        this.cards = this.updateEntity(card, this.cards)
        return Promise.resolve(card)
    }

    saveDeck(deck: Deck): Promise<Deck> {
        return this.saveEntity(deck, this.decks)
    }

    updateDeck(deck: Deck): Promise<Deck> {
        this.decks = this.updateEntity(deck, this.decks)
        return Promise.resolve(deck)
    }

    saveCollection(collection: Collection): Promise<Collection> {
        return this.saveEntity(collection, this.collections)
    }

    updateCollection(collection: Collection): Promise<Collection> {
        this.collections = this.updateEntity(collection, this.collections)
        return Promise.resolve(collection)
    }

    deleteUser(id: string): Promise<string> {
        this.users = this.users.filter(it => it.id !== id)
        return Promise.resolve(id)
    }

    deleteCard(id: string): Promise<string> {
        this.cards = this.cards.filter(it => it.id !== id)
        return Promise.resolve(id)
    }

    deleteDeck(id: string): Promise<string> {
        this.decks = this.decks.filter(it => it.id !== id)
        return Promise.resolve(id)
    }

    deleteCollection(id: string): Promise<string> {
        this.collections = this.collections.filter(it => it.id !== id)
        return Promise.resolve(id)
    }

    findUser(id: string): Promise<User> {
        return this.findEntity(id, this.users)
    }

    findCard(id: string): Promise<Card> {
        return this.findEntity(id, this.cards)
    }

    findDeck(id: string): Promise<Deck> {
        return this.findEntity(id, this.decks)
    }

    findCollection(id: string): Promise<Collection> {
        return this.findEntity(id, this.collections)
    }


    findDecksByCollectionId(collectionId: string): Promise<Array<Deck>> {
        return Promise.resolve(this.decks.filter(it => it.collectionId === collectionId))
    }


    findCardsByDeckId(deckId: string): Promise<Array<Card>> {
        return Promise.resolve(this.cards.filter(it => it.deckId === deckId))
    }

    findUserByEmail(email: string): Promise<User | void> {
        return Promise.resolve(this.users.find(it => it.email === email))
    }

    findCollectionByUserEmail(email: string): Promise<Collection | void> {
        return this.findUserByEmail(email).then(user =>
            // $FlowFixMe
            Promise.resolve(this.collections.find(it => it.userId === user.id)))
    }

    init(clearDatabase: boolean): Promise<void> {
        return Promise.resolve()
    }

    saveEntity(entity: (User | Collection | Deck | Card), array: Array<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            entity.id = "" + this.idCounter++

            array.push(entity)

            resolve(entity)
        })
    }

    updateEntity(entity: (User | Collection | Deck | Card), array: Array<any>): Array<any> {
        const newArray = array.filter(it => it.id !== entity.id)
        newArray.push(entity)
        return newArray
    }

    findEntity(id: string, array: Array<any>): Promise<any> {
        return Promise.resolve(array.find(it => it.id === id))
    }
}