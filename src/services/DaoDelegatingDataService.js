//@flow
import type { AnswerType, Clock, DataService } from './APIDomain'
import * as api from './APIDomain'
import { CardDetail, CardDetailResponse, CollectionResponse, DeckResponse, ReviewsResponse } from './APIDomain'
import type { Dao, FormatType } from '../persist/Dao'
import {
  Card,
  Deck,
  newCard,
  newDeck,
  newTemplate,
  newUser,
  Template,
  Templates,
  TEST_USER_EMAIL,
  User
} from '../persist/Dao'
import BusinessRules from './BusinessRules'

export default class DaoDelegatingDataService implements DataService {
  dao: Dao
  clock: Clock
  businessRules: BusinessRules

  constructor (dao: Dao, clock: Clock) {
    this.dao = dao
    this.clock = clock
    this.businessRules = new BusinessRules()
  }

  currentTimeMillis (): number {
    return this.clock.epochMilliseconds()
  }

  async init (clearDatabase: boolean): Promise<void> {
    await this.dao.init(clearDatabase)
    const u = await this.dao.findUserByEmail(TEST_USER_EMAIL)

    if (u === undefined) {
      await this.dao.saveUser(newUser(TEST_USER_EMAIL))
    }
  }

  async fetchCollection (email: string): Promise<api.CollectionResponse> {
    const user: ?User = await this.dao.findUserByEmail(email)
    if (user) {
      const decks: Array<Deck> = await this.dao.findDecksByUserId(user.id)
      const cardsForDecks: Array<Array<Card>> = await Promise.all(
        decks.map(deck => this.dao.findCardsByDeckId(deck.id)))

      return this.businessRules.decksToAPICollectionResponse(
        this.clock.epochMilliseconds(), decks, cardsForDecks)
    } else {
      throw new Error(`No user found with email ${email}`)
    }
  }

  async fetchDeck (id: string): Promise<api.DeckResponse> {
    const now = this.clock.epochMilliseconds()
    const deck = await this.dao.findDeck(id)

    if (deck) {
      const deckName = deck.name
      const cards = await this.dao.findCardsByDeckId(deck.id)

      const apiCards = cards.map(card => this.businessRules.cardToAPICard(now, card))
      return new DeckResponse(id, deckName, apiCards)
    } else {
      throw new Error(`No deck found with id ${id}`)
    }
  }

  async addDeck (email: string, name: string): Promise<CollectionResponse> {
    const user = await this.dao.findUserByEmail(email)
    if (user) {
      await this.dao.saveDeck(newDeck(user.id, name))
      return this.fetchCollection(email)
    } else {
      throw new Error(`No user found with email ${email}`)
    }
  }

  async updateDeck (id: string, name: string): Promise<CollectionResponse> {
    const deck = await this.dao.findDeck(id)
    if (!deck) {
      throw new Error(`No deck found with id ${id}`)
    }
    await this.dao.updateDeck(new Deck(id, deck.userId, name))
    return this.fetchCollection(TEST_USER_EMAIL)
  }

  async deleteDeck (email: string, id: string): Promise<CollectionResponse> {
    const cards = await this.dao.findCardsByDeckId(id)

    await Promise.all(cards.map(it => this.dao.deleteCard(it.id)))
    await this.dao.deleteDeck(id)

    return this.fetchCollection(email)
  }

  async addCard (deckId: string, format: FormatType, question: string, answer: string): Promise<CardDetail> {
    const deck = await this.dao.findDeck(deckId)
    if (deck) {
      const template = await this.dao.saveTemplate(newTemplate(deck.id, Templates.FRONT_BACK, format, question, answer))
      const card = await this.dao.saveCard(newCard(template.id, 1))
      return this.createCardDetail(template, card)
    } else {
      throw new Error(`No deck with id ${deckId}`)
    }
  }

  async updateCard (cardId: string, format: FormatType, question: string, answer: string): Promise<CardDetail> {
    const card = await this.dao.findCard(cardId)
    if (card) {
      const template = await this.dao.findTemplate(card.templateId)
      if (!template) {
        throw new Error(`No template with id ${card.templateId}`)
      }
      const updated = new Template(template.id, template.deckId, template.type, format, question, answer)
      await this.dao.updateTemplate(updated)
      return this.createCardDetail(updated, card)
    } else {
      throw new Error(`No card with id ${cardId}`)
    }
  }

  async deleteCard (email: string, id: string): Promise<DeckResponse> {
    const card = await this.dao.findCard(id)
    if (!card) {
      throw new Error(`No card with id ${id}`)
    }

    const template = await this.dao.findTemplate(card.templateId)
    if (!template) {
      throw new Error(`No template with id ${card.templateId}`)
    }

    const reviews = await this.dao.findReviewsByCardId(id)
    await Promise.all(reviews.map(it => this.dao.deleteReview(it.id)))

    const cards = await this.dao.findCardsByTemplateId(template.id)
    if (cards.length === 1) {
      await this.dao.deleteTemplate(template.id)
    }

    await this.dao.deleteCard(id)

    return this.fetchDeck(template.deckId)
  }

  async fetchCards (ids: Array<string>): Promise<CardDetailResponse> {
    const cards: Array<Card | void> = await Promise.all(ids.map(id => this.dao.findCard(id)))
    const details = []
    for (let card of cards) {
      if (card) {
        const template = await this.dao.findTemplate(card.templateId)
        if (!template) {
          throw new Error(`Unable to find template for card ${card.id}`)
        }
        details.push(this.createCardDetail(template, card))
      }
    }
    return new CardDetailResponse(details)
  }

  async fetchReviews (cardId: string): Promise<ReviewsResponse> {
    const reviews = await this.dao.findReviewsByCardId(cardId)
    return new ReviewsResponse(reviews)
  }

  async answerCard (id: string, startTime: number, endTime: number, answer: AnswerType): Promise<CardDetail> {
    const card = await this.dao.findCard(id)
    if (card) {
      const template = await this.dao.findTemplate(card.templateId)
      if (!template) {
        throw new Error(`Unable to find template for card ${id}`)
      }

      const {updatedCard, review} = this.businessRules.cardAnswered(startTime, endTime, card, answer)
      const newCard = await this.dao.updateCard(updatedCard)

      await this.dao.saveReview(review)

      return this.createCardDetail(template, newCard)
    } else {
      // TODO: Need to send back an error response
      throw new Error(`Card with id ${id} doesn't exist.`)
    }
  }

  createCardDetail (template: Template, card: Card): CardDetail {
    const intervals = this.businessRules.currentAnswerIntervals(card)
    const failInterval = intervals[0]
    const hardInterval = intervals[1]
    const goodInterval = intervals[2]
    const easyInterval = intervals[3]
    return new CardDetail(card.id, template.field1, template.field2, template.format,
      failInterval, hardInterval, goodInterval, easyInterval, card.due)
  }
}