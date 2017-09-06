//@flow
import type { AnswerType, Clock, DataService } from './APIDomain'
import { CardDetail, CardDetailResponse, CollectionResponse, DeckResponse, ReviewsResponse } from './APIDomain'
import DynamoDBDao from '../persist/dynamodb/DynamoDBDao'
import DaoDelegatingDataService from './DaoDelegatingDataService'
import { InMemoryDao } from '../fakeData/InMemoryDao'
import type { FormatType } from '../persist/Dao'
import { init as daoInit } from '../persist/Dao'

export class SystemClock implements Clock {
  epochMilliseconds = (): number => {
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
  currentTimeMillis = (): number => {
    return this.delegate.currentTimeMillis()
  }
  init = async (clearDatabase: boolean): Promise<void> => {
    await this.delegate.init(clearDatabase)
    daoInit(this.currentTimeMillis(), dao, clearDatabase)
  }

  addDeck = (email: string, name: string): Promise<CollectionResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => this.delegate.addDeck(email, name).then(resolve), this.timeoutDelay)
    })
  }
  updateDeck = (id: string, name: string): Promise<CollectionResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => this.delegate.updateDeck(id, name).then(resolve), this.timeoutDelay)
    })
  }
  deleteDeck = (email: string, id: string): Promise<CollectionResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => this.delegate.deleteDeck(email, id).then(resolve), this.timeoutDelay)
    })
  }
  fetchCollection = (email: string): Promise<CollectionResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => this.delegate.fetchCollection(email).then(resolve), this.timeoutDelay)
    })
  }
  fetchDeck = (id: string): Promise<DeckResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => this.delegate.fetchDeck(id).then(resolve), this.timeoutDelay)
    })
  }
  fetchCards = (ids: Array<string>): Promise<CardDetailResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => this.delegate.fetchCards(ids).then(resolve), this.timeoutDelay)
    })
  }
  fetchReviews = (cardId: string): Promise<ReviewsResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => this.delegate.fetchReviews(cardId).then(resolve), this.timeoutDelay)
    })
  }
  answerCard = (id: string, startTime: number, endTime: number, answer: AnswerType): Promise<CardDetail> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => this.delegate.answerCard(id, startTime, endTime, answer).then(resolve), this.timeoutDelay)
    })
  }
  addCard = (deckId: string, format: FormatType, question: string, answer: string): Promise<CardDetail> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => this.delegate.addCard(deckId, format, question, answer).then(resolve), this.timeoutDelay)
    })
  }
  updateCard = (cardId: string, format: FormatType, question: string, answer: string): Promise<CardDetail> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => this.delegate.updateCard(cardId, format, question, answer).then(resolve), this.timeoutDelay)
    })
  }
  deleteCard = (email: string, id: string): Promise<DeckResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => this.delegate.deleteCard(email, id).then(resolve), this.timeoutDelay)
    })
  }

  constructor (clock: Clock) {
    this.timeoutDelay = 250
    this.delegate = new DaoDelegatingDataService(dao, clock)
  }
}

const clock = new SystemClock()
const service = new DelegatingDataService(clock)

export default service