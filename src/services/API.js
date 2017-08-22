import type {DataService} from "./APIDomain"
import DynamoDBDao from "../persist/dynamodb/DynamoDBDao"
import DaoDelegatingDataService from "./DaoDelegatingDataService"

export class SystemClock {
    epochSeconds(): number {
        return new Date().getTime()
    }
}

const REGION = 'us-east-1'
const ENDPOINT = process.env.NODE_ENV === 'production' ?
    `https://dynamodb.${REGION}.amazonaws.com` :
    'http://localhost:8000'

console.log(`Using region: ${REGION} and endpoint: ${ENDPOINT}`)

class DelegatingDataService implements DataService {

    timeoutDelay: number
    delegate: DataService

    constructor(clock: Clock) {
        this.timeoutDelay = 250
        this.delegate = new DaoDelegatingDataService(new DynamoDBDao(REGION, ENDPOINT));

        (this: any).answerCard = this.answerCard.bind(this);
        (this: any).addDeck = this.addDeck.bind(this);
        (this: any).fetchCollection = this.fetchCollection.bind(this);
        (this: any).fetchDeck = this.fetchDeck.bind(this);
        (this: any).fetchCards = this.fetchCards.bind(this);
        (this: any).answerCard = this.answerCard.bind(this);
        (this: any).addCard = this.addCard.bind(this)
    }

    init(clearDatabase: boolean): Promise<void> {
        return this.delegate.init(clearDatabase);
    }

    addDeck(email: string, name: string): Promise<CollectionResponse> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.addDeck(email, name).then(resolve), this.timeoutDelay)
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

    answerCard(id: string, answer: string): Promise<CardDetail> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.answerCard(id, answer).then(resolve), this.timeoutDelay)
        })
    }

    addCard(deckId: string, question: string, answer: string): Promise<CardDetail> {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.delegate.addCard(deckId, question, answer).then(resolve), this.timeoutDelay)
        })
    }
}

const clock = new SystemClock()
const service = new DelegatingDataService(clock)

export default service