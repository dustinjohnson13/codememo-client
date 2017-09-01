//@flow
import type {AnswerType, Clock, DataService} from "./APIDomain"
import {CardDetail, CardDetailResponse, CollectionResponse, DeckResponse, ReviewsResponse} from "./APIDomain"
import DynamoDBDao from "../persist/dynamodb/DynamoDBDao"
import DaoDelegatingDataService from "./DaoDelegatingDataService"
import {fakeCards, fakeReviews, InMemoryDao, REVIEW_END_TIME} from "../fakeData/InMemoryDao"
import type {FormatType} from "../persist/Dao"
import {Card, newDeck, TEST_DECK_NAME, TEST_USER_EMAIL} from "../persist/Dao"

export class SystemClock implements Clock {
    epochMilliseconds(): number {
        return new Date().getTime()
    }
}

let dao = new InMemoryDao()

if (process.env.NODE_ENV === 'production') {
    const REGION = 'us-east-1'
    const ENDPOINT = `https://dynamodb.${REGION}.amazonaws.com`

    dao = new DynamoDBDao(REGION, ENDPOINT, '', '')
}

class DelegatingDataService implements DataService {

    timeoutDelay: number
    delegate: DataService

    constructor(clock: Clock) {
        this.timeoutDelay = 250
        this.delegate = new DaoDelegatingDataService(dao, clock);

        (this: any).answerCard = this.answerCard.bind(this);
        (this: any).addDeck = this.addDeck.bind(this);
        (this: any).deleteDeck = this.deleteDeck.bind(this);
        (this: any).fetchCollection = this.fetchCollection.bind(this);
        (this: any).fetchDeck = this.fetchDeck.bind(this);
        (this: any).fetchCards = this.fetchCards.bind(this);
        (this: any).answerCard = this.answerCard.bind(this);
        (this: any).addCard = this.addCard.bind(this)
    }

    currentTimeMillis(): number {
        return this.delegate.currentTimeMillis()
    }

    async init(clearDatabase: boolean): Promise<void> {
        await this.delegate.init(clearDatabase);

        await dao.findUserByEmail(TEST_USER_EMAIL)
        //$FlowFixMe
            .then(user => dao.saveDeck(newDeck(user.id, TEST_DECK_NAME)))
            .then(deck => {
                const currentTime = clock.epochMilliseconds()
                const {templates, cards} = fakeCards(currentTime, deck.id, 80,
                    27, 23, false)
                const reviews = fakeReviews(REVIEW_END_TIME, cards[0].id, 1, false)

                return Promise.all(templates.map(it => dao.saveTemplate(it))).then(templates =>
                    Promise.all(cards.map((card, idx) => {
                        const cardWithTemplateId = new Card(card.id, templates[idx].id, card.cardNumber, card.goodInterval, card.due)
                        return dao.saveCard(cardWithTemplateId)
                    })).then(() => reviews.map(it => dao.saveReview(it))))
            })

    }

    addDeck(email: string, name: string): Promise<CollectionResponse> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.addDeck(email, name).then(resolve), this.timeoutDelay)
        })
    }

    deleteDeck(email: string, id: string): Promise<CollectionResponse> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.deleteDeck(email, id).then(resolve), this.timeoutDelay)
        })
    }

    fetchCollection(email: string): Promise<CollectionResponse> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.fetchCollection(email).then(resolve), this.timeoutDelay)
        })
    }

    fetchDeck(id: string): Promise<DeckResponse> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.fetchDeck(id).then(resolve), this.timeoutDelay)
        })
    }

    fetchCards(ids: Array<string>): Promise<CardDetailResponse> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.fetchCards(ids).then(resolve), this.timeoutDelay)
        })
    }

    fetchReviews(cardId: string): Promise<ReviewsResponse> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.fetchReviews(cardId).then(resolve), this.timeoutDelay)
        })
    }

    answerCard(id: string, startTime: number, endTime: number, answer: AnswerType): Promise<CardDetail> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.answerCard(id, startTime, endTime, answer).then(resolve), this.timeoutDelay)
        })
    }

    addCard(deckId: string, format: FormatType, question: string, answer: string): Promise<CardDetail> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.addCard(deckId, format, question, answer).then(resolve), this.timeoutDelay)
        })
    }

    deleteCard(email: string, id: string): Promise<DeckResponse> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.deleteCard(email, id).then(resolve), this.timeoutDelay)
        })
    }
}

const clock = new SystemClock()
const service = new DelegatingDataService(clock)

export default service