//@flow
import type { AnswerType } from '../services/APIDomain'
import { Answer, MINUTES_PER_DAY } from '../services/APIDomain'
import { fakeCards, fakeReviews, REVIEW_END_TIME } from '../fakeData/InMemoryDao'

export const USER_TABLE = 'user'
export const CARD_TABLE = 'card'
export const TEMPLATE_TABLE = 'template'
export const DECK_TABLE = 'deck'
export const REVIEW_TABLE = 'review'
export const ALL_TABLES = [
  USER_TABLE, CARD_TABLE, TEMPLATE_TABLE, DECK_TABLE, REVIEW_TABLE
]

export const NO_ID = 'NONE'
export const DUE_IMMEDIATELY = -1
export const TEST_USER_EMAIL = 'someone@blah.com'
export const TEST_DECK_NAME = 'Test Deck'

export const Templates = {
  FRONT_BACK: 'FRONT_BACK'
}

export type TemplateType = $Keys<typeof Templates>;

export const templateTypeToDBId = (type: TemplateType): number => {
  switch (type) {
    case Templates.FRONT_BACK:
      return 1
    default:
      throw new Error(`Unrecognized type: ${type}`)
  }
}

export const templateTypeFromDBId = (id: number): TemplateType => {
  switch (id) {
    case 1:
      return Templates.FRONT_BACK
    default:
      throw new Error(`Unrecognized Template DB id: ${id}`)
  }
}

export const Format = {
  PLAIN: 'PLAIN',
  HTML: 'HTML'
}

export type FormatType = $Keys<typeof Format>;

export const formatTypeToDBId = (type: FormatType): number => {
  switch (type) {
    case Format.PLAIN:
      return 1
    case Format.HTML:
      return 2
    default:
      throw new Error(`Unrecognized type: ${type}`)
  }
}

export const formatTypeFromDBId = (id: number): FormatType => {
  switch (id) {
    case 1:
      return Format.PLAIN
    case 2:
      return Format.HTML
    default:
      throw new Error(`Unrecognized Format DB id: ${id}`)
  }
}

export const answerTypeToDBId = (type: AnswerType): number => {
  switch (type) {
    case Answer.FAIL:
      return 1
    case Answer.HARD:
      return 2
    case Answer.GOOD:
      return 3
    case Answer.EASY:
      return 4
    default:
      throw new Error(`Unrecognized type: ${type}`)
  }
}

export const answerTypeFromDBId = (id: number): AnswerType => {
  switch (id) {
    case 1:
      return Answer.FAIL
    case 2:
      return Answer.HARD
    case 3:
      return Answer.GOOD
    case 4:
      return Answer.EASY
    default:
      throw new Error(`Unrecognized Answer DB id: ${id}`)
  }
}

export class Entity {
  +id: string

  constructor (id: string) {
    (this: any).id = id
  }
}

export class User extends Entity {
  +email: string

  constructor (id: string, email: string) {
    super(id);
    (this: any).email = email
  }
}

export class Deck extends Entity {
  +userId: string
  +name: string

  constructor (id: string, userId: string, name: string) {
    super(id);
    (this: any).userId = userId;
    (this: any).name = name
  }
}

export class Template extends Entity {
  +deckId: string
  +type: TemplateType
  +format: FormatType
  +field1: string
  +field2: string

  constructor (id: string, deckId: string, type: TemplateType, format: FormatType, field1: string, field2: string) {
    super(id);
    (this: any).deckId = deckId;
    (this: any).type = type;
    (this: any).format = format;
    (this: any).field1 = field1;
    (this: any).field2 = field2
  }
}

export class Card extends Entity {
  +templateId: string
  +cardNumber: number
  +goodInterval: number
  +due: number

  constructor (id: string, templateId: string, cardNumber: number, goodInterval: number, due: number) {
    super(id);
    (this: any).templateId = templateId;
    (this: any).cardNumber = cardNumber;
    (this: any).goodInterval = goodInterval;
    (this: any).due = due
  }
}

export class Review extends Entity {
  +cardId: string
  +startTime: number
  +endTime: number
  +answer: AnswerType

  constructor (id: string, cardId: string, startTime: number, endTime: number, answer: AnswerType) {
    super(id);
    (this: any).cardId = cardId;
    (this: any).startTime = startTime;
    (this: any).endTime = endTime;
    (this: any).answer = answer
  }
}

export interface Dao {

  init(clearDatabase: boolean): Promise<void>;

  saveUser(user: User): Promise<User>;

  saveTemplate(template: Template): Promise<Template>;

  saveDeck(deck: Deck): Promise<Deck>;

  saveCard(card: Card): Promise<Card>;

  saveReview(review: Review): Promise<Review>;

  updateUser(user: User): Promise<User>;

  updateDeck(deck: Deck): Promise<Deck>;

  updateTemplate(template: Template): Promise<Template>;

  updateCard(card: Card): Promise<Card>;

  updateReview(review: Review): Promise<Review>;

  deleteUser(id: string): Promise<string>;

  deleteDeck(id: string): Promise<string>;

  deleteTemplate(id: string): Promise<string>;

  deleteCard(id: string): Promise<string>;

  deleteReview(id: string): Promise<string>;

  findUser(id: string): Promise<User | void>;

  findDeck(id: string): Promise<Deck | void>;

  findTemplate(id: string): Promise<Template | void>;

  findCard(id: string): Promise<Card | void>;

  findReview(id: string): Promise<Review | void>;

  findReviewsByCardId(cardId: string): Promise<Array<Review>>;

  findDecksByUserId(userId: string): Promise<Array<Deck>>;

  findTemplatesByDeckId(deckId: string): Promise<Array<Template>>;

  findCardsByDeckId(deckId: string): Promise<Array<Card>>;

  findCardsByTemplateId(templateId: string): Promise<Array<Card>>;

  findUserByEmail(email: string): Promise<User | void>;
}

export const newUser = (email: string) => new User(NO_ID, email)

export const newDeck = (userId: string, name: string) => new Deck(NO_ID, userId, name)

export const newTemplate = (deckId: string, type: TemplateType, format: FormatType, field1: string, field2: string) =>
  new Template(NO_ID, deckId, type, format, field1, field2)

export const newCard = (templateId: string, cardNumber: number) =>
  new Card(NO_ID, templateId, cardNumber, MINUTES_PER_DAY, DUE_IMMEDIATELY)

export const newReview = (cardId: string, startTime: number, endTime: number, answer: AnswerType): Review => {
  return new Review(NO_ID, cardId, startTime, endTime, answer)
}

export const init = async (currentTime: number, dao: Dao, clearDatabase: boolean): Promise<{ loadedDecks: Deck[], loadedTemplates: Template[], loadedCards: Card[] }> => {
  await dao.init(clearDatabase)

  let user = await dao.findUserByEmail(TEST_USER_EMAIL)
  if (user === undefined) {
    user = await dao.saveUser(newUser(TEST_USER_EMAIL))
  }

  const deck = await dao.saveDeck(newDeck(user.id, TEST_DECK_NAME))

  const {templates, cards} = fakeCards(currentTime, deck.id, 80,
    27, 23, false)

  const persistedTemplates = await Promise.all(templates.map(t => dao.saveTemplate(t)))

  const persistedCards = await Promise.all(cards.map((card, idx) => {
    const cardWithTemplateId = new Card(card.id, persistedTemplates[idx].id, card.cardNumber, card.goodInterval, card.due)
    return dao.saveCard(cardWithTemplateId)
  }))

  const reviews = fakeReviews(REVIEW_END_TIME, persistedCards[0].id, 1, false)
    .concat(fakeReviews(REVIEW_END_TIME, persistedCards[1].id, 3, false))

  await Promise.all(reviews.map(r => dao.saveReview(r)))

  return {loadedDecks: [deck], loadedTemplates: persistedTemplates, loadedCards: persistedCards}
}