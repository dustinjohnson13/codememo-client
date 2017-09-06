import type { Dao, FormatType, TemplateType } from '../persist/Dao'
import { Card, Deck, Review, Template, User } from '../persist/Dao'
import type { AnswerType } from './APIDomain'

class ExportReview {
  +startTime: number
  +endTime: number
  +answer: AnswerType

  constructor (review: Review) {
    (this: any).startTime = review.startTime;
    (this: any).endTime = review.endTime;
    (this: any).answer = review.answer
  }
}

class ExportCard {
  +cardNumber: number
  +goodInterval: number
  +due: number
  +reviews: Array<{| [string]: ExportReview |}>

  constructor (card: Card, reviews: Array<{| [string]: ExportReview |}>) {
    (this: any).cardNumber = card.cardNumber;
    (this: any).goodInterval = card.goodInterval;
    (this: any).due = card.due;
    (this: any).reviews = reviews
  }
}

class ExportTemplate {
  +type: TemplateType
  +format: FormatType
  +field1: string
  +field2: string
  +cards: Array<{| [string]: ExportCard |}>

  constructor (template: Template, cards: Array<{| [string]: ExportCard |}>) {
    (this: any).type = template.type;
    (this: any).format = template.format;
    (this: any).field1 = template.field1;
    (this: any).field2 = template.field2;
    (this: any).cards = cards
  }
}

class ExportDeck {
  +name: string
  +templates: Array<{| [string]: ExportTemplate |}>

  constructor (deck: Deck, templates: Array<{| [string]: ExportTemplate |}>) {
    (this: any).name = deck.name;
    (this: any).templates = templates
  }
}

class ExportUser {
  +email: string
  +decks: Array<{| [string]: ExportDeck |}>

  constructor (user: User, decks: Array<{| [string]: ExportDeck |}>) {
    (this: any).email = user.email;
    (this: any).decks = decks
  }
}

class ExportCollection {
  +email: string
  +decks: Array<{| [string]: ExportDeck |}>

  constructor (user: User, decks: Array<{| [string]: ExportDeck |}>) {
    (this: any).email = user.email;
    (this: any).decks = decks
  }
}

export const exportCollectionToJson = async (dao: Dao, email: string) => {

  const user = await dao.findUserByEmail(email)
  if (!user) {
    throw new Error(`No user with email ${email}`)
  }

  const decks = await dao.findDecksByUserId(user.id)
  const templatesByDeckId: Map<string, Template[]> = new Map()
  const cardsByTemplateId: Map<string, Card[]> = new Map()
  const reviewsByCardId: Map<string, Review[]> = new Map()

  await Promise.all(decks.map(deck => {
    return dao.findTemplatesByDeckId(deck.id).then(it => templatesByDeckId.set(deck.id, it))
  }))

  const templateIds = Array.from(templatesByDeckId.values())
    .reduce((current, templates) => current.concat(templates))
    .map(it => it.id)

  await Promise.all(templateIds.map(templateId => {
    return dao.findCardsByTemplateId(templateId).then(it => {
      cardsByTemplateId.set(templateId, it)
    })
  }))

  const cardIds = Array.from(cardsByTemplateId.values())
    .reduce((current, cards) => current.concat(cards))
    .map(it => it.id)

  await Promise.all(cardIds.map(id => {
    return dao.findReviewsByCardId(id).then(it => {
      reviewsByCardId.set(id, it)
    })
  }))

  const exportDecks = entitiesToJson(decks, (deck: Deck) => {

    const templates = templatesByDeckId.get(deck.id)

    const exportTemplates = entitiesToJson(templates, (template: Template) => {
      const cards = cardsByTemplateId.get(template.id)
      const exportCards = entitiesToJson(cards, (card: Card) => {
        const reviews = reviewsByCardId.get(card.id)
        const exportReviews = entitiesToJson(reviews, (review: Review) => new ExportReview(review))

        return new ExportCard(card, exportReviews)
      })

      return new ExportTemplate(template, exportCards)
    })

    return new ExportDeck(deck, exportTemplates)
  })

  const exportUser = new ExportUser(user, exportDecks)

  return JSON.stringify({
    [user.id]: exportUser
  }, null, 2)
}

export const importCollectionFromJson = (json: string): {|
  users: User[], decks: Deck[],
  templates: Template[], cards: Card[], reviews: Review[]
|} => {
  const obj = JSON.parse(json)

  let users = []
  let decks = []
  let templates = []
  let cards = []
  let reviews = []

  users = users.concat(createEntityFromImportObj(obj, (id: string, obj: any) => {
    const user = new User(id, obj.email)

    for (const deckObj of obj.decks) {
      decks = decks.concat(createEntityFromImportObj(deckObj, (id: string, obj: any) => {

        const deck = new Deck(id, user.id, obj.name)

        for (const templateObj of obj.templates) {

          templates = templates.concat(createEntityFromImportObj(templateObj, (id: string, obj: any) => {

            const template = new Template(id, deck.id, obj.type, obj.format, obj.field1, obj.field2)

            for (const cardObj of obj.cards) {

              cards = cards.concat(createEntityFromImportObj(cardObj, (id: string, obj: any) => {

                const card = new Card(id, template.id, obj.cardNumber, obj.goodInterval, obj.due)

                for (const reviewObj of obj.reviews) {
                  reviews = reviews.concat(createEntityFromImportObj(reviewObj, (id: string, obj: any) =>
                    new Review(id, card.id, obj.startTime, obj.endTime, obj.answer)))
                }

                return card
              }))

            }

            return template
          }))
        }

        return deck
      }))
    }

    return user
  }))

  return {users: users, decks: decks, templates: templates, cards: cards, reviews: reviews}
}

const createEntityFromImportObj = (importObj, createEntity: (id: string, obj: any) => any): Array<any> => {
  const retVal = []
  const ids = Object.keys(importObj)

  for (const id of ids) {
    const obj = importObj[id]
    retVal.push(createEntity(id, obj))
  }

  return retVal
}

const entitiesToJson = <Entity, U> (entities, exportFunction: (entity: Entity) => U) => {
  return (entities) ? entities.reduce((current, entity) => {

    return [...current, {[`${entity.id}`]: exportFunction(entity)}]
  }, []) : []
}