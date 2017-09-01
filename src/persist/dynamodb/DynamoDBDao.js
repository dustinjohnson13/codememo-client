//@flow
import IndexDefinition from './IndexDefinition'
import type { Dao } from '../Dao'
import {
  ALL_TABLES,
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
} from '../Dao'
import uuid from 'uuid'
import AWS from 'aws-sdk'

const DYNAMODB_STRING = 'S'
const DYNAMODB_HASH = 'HASH'
const DYNAMODB_PROJECT_ALL = 'ALL'

const DEFAULT_READ_CAPACITY_UNITS = 1
const DEFAULT_WRITE_CAPACITY_UNITS = 1

const ID_COLUMN = 'id'
const NAME_COLUMN = 'n'
const USER_ID_COLUMN = 'uId'
const GOOD_INTERVAL_COLUMN = 'g'
const DUE_COLUMN = 'd'
const FORMAT_COLUMN = 'f'
const FIELD1_COLUMN = 'f1'
const FIELD2_COLUMN = 'f2'
const TYPE_COLUMN = 't'
const CARD_NUMBER_COLUMN = 'n'
const START_TIME_COLUMN = 'st'
const END_TIME_COLUMN = 'et'
const ANSWER_COLUMN = 'a'

const EMAIL_INDEX = 'email'
const DECK_ID_INDEX = 'dId'
const TEMPLATE_ID_INDEX = 'tId'
const USER_ID_INDEX = 'uId'
const CARD_ID_INDEX = 'cId'

const hydrateUser = (item): User | void => {
  return item ? new User(item[ID_COLUMN], item[EMAIL_INDEX]) : undefined
}

const hydrateDeck = (item): Deck | void => {
  return item ? new Deck(item[ID_COLUMN], item[USER_ID_COLUMN], item[NAME_COLUMN]) : undefined
}

const hydrateTemplate = (item): Template | void => {
  return item ? new Template(item[ID_COLUMN], item[DECK_ID_INDEX], templateTypeFromDBId(item[TYPE_COLUMN]),
    formatTypeFromDBId(item[FORMAT_COLUMN]), item[FIELD1_COLUMN], item[FIELD2_COLUMN]) : undefined
}

const hydrateCard = (item): Card | void => {
  return item ? new Card(item[ID_COLUMN], item[TEMPLATE_ID_INDEX], item[CARD_NUMBER_COLUMN],
    item[GOOD_INTERVAL_COLUMN], item[DUE_COLUMN]) : undefined
}

const hydrateReview = (item): Review | void => {
  return item ? new Review(item[ID_COLUMN], item[CARD_ID_INDEX], item[START_TIME_COLUMN], item[END_TIME_COLUMN], answerTypeFromDBId(item[ANSWER_COLUMN])) : undefined
}

export default class DynamoDBDao implements Dao {

  region: string
  endpoint: string

  constructor (region: string, endpoint: string, accessKeyId: string, secretAccessKey: string) {
    this.region = region
    this.endpoint = endpoint

    console.log(`Using region: ${region} and endpoint: ${endpoint}`)

    let newAWSConfig = {
      ...AWS.config,
      region: this.region,
      endpoint: this.endpoint
    }

    if (accessKeyId && secretAccessKey) {
      newAWSConfig = {
        ...newAWSConfig,
        credentials: new AWS.Credentials(accessKeyId, secretAccessKey)
      }
    }

    AWS.config.update(newAWSConfig)
  }

  async init (clearDatabase: boolean): Promise<void> {
    // Note: DynamoDB secondary indexes don't guarantee uniqueness
    const tables: Array<string> = await this.listTables()
    if (tables.length === 0) {
      return this.createTables()
    } else {
      if (clearDatabase) {
        await Promise.all(ALL_TABLES.map(table => this.dropTable(table)))
        await this.createTables()
      }
    }
  }

  async createTables (): Promise<void> {
    await Promise.all([
      this.createTable(USER_TABLE, [new IndexDefinition(EMAIL_INDEX, DYNAMODB_STRING)]),
      this.createTable(DECK_TABLE, [new IndexDefinition(USER_ID_INDEX, DYNAMODB_STRING)]),
      this.createTable(TEMPLATE_TABLE, [new IndexDefinition(DECK_ID_INDEX, DYNAMODB_STRING)]),
      this.createTable(CARD_TABLE, [new IndexDefinition(TEMPLATE_ID_INDEX, DYNAMODB_STRING)]),
      this.createTable(REVIEW_TABLE, [new IndexDefinition(CARD_ID_INDEX, DYNAMODB_STRING)])
    ])
  }

  listTables (): Promise<Array<string>> {
    const dynamodb = new AWS.DynamoDB()

    return new Promise((resolve, reject) => {
      dynamodb.listTables({Limit: 10}, (err, data) => {
        if (err) {
          console.log('Error', err.code)
          reject(err)
        } else {
          resolve(data.TableNames)
        }
      })
    })
  }

  async saveUser (user: User): Promise<User> {
    const id = uuid.v1()
    const fields = {[EMAIL_INDEX]: user.email}

    await this.insert(USER_TABLE, {[ID_COLUMN]: id}, fields)
    return new User(id, user.email)
  }

  async saveTemplate (template: Template): Promise<Template> {
    const id = uuid.v1()
    const fields: Object = {
      [DECK_ID_INDEX]: template.deckId,
      [TYPE_COLUMN]: templateTypeToDBId(template.type),
      [FORMAT_COLUMN]: formatTypeToDBId(template.format),
      [FIELD1_COLUMN]: template.field1,
      [FIELD2_COLUMN]: template.field2
    }

    await this.insert(TEMPLATE_TABLE, {[ID_COLUMN]: id}, fields)
    return new Template(id, template.deckId, template.type, template.format, template.field1, template.field2)
  }

  async saveCard (card: Card): Promise<Card> {
    const id = uuid.v1()
    const fields: Object = {
      [TEMPLATE_ID_INDEX]: card.templateId,
      [CARD_NUMBER_COLUMN]: card.cardNumber,
      [GOOD_INTERVAL_COLUMN]: card.goodInterval,
      [DUE_COLUMN]: card.due
    }

    await this.insert(CARD_TABLE, {[ID_COLUMN]: id}, fields)
    return new Card(id, card.templateId, card.cardNumber, card.goodInterval, card.due)
  }

  async saveDeck (deck: Deck): Promise<Deck> {
    const id = uuid.v1()
    const fields: Object = {[NAME_COLUMN]: deck.name, [USER_ID_INDEX]: deck.userId}

    await this.insert(DECK_TABLE, {[ID_COLUMN]: id}, fields)
    return new Deck(id, deck.userId, deck.name)
  }

  async saveReview (review: Review): Promise<Review> {
    const id = uuid.v1()
    const fields: Object = {
      [CARD_ID_INDEX]: review.cardId,
      [START_TIME_COLUMN]: review.startTime,
      [END_TIME_COLUMN]: review.endTime,
      [ANSWER_COLUMN]: answerTypeToDBId(review.answer)
    }

    await this.insert(REVIEW_TABLE, {[ID_COLUMN]: id}, fields)
    return new Review(id, review.cardId, review.startTime, review.endTime, review.answer)
  }

  deleteUser (id: string): Promise<string> {
    return this.deleteEntity(USER_TABLE, {[ID_COLUMN]: id}).then(() => id)
  }

  deleteTemplate (id: string): Promise<string> {
    return this.deleteEntity(TEMPLATE_TABLE, {[ID_COLUMN]: id}).then(() => id)
  }

  deleteCard (id: string): Promise<string> {
    return this.deleteEntity(CARD_TABLE, {[ID_COLUMN]: id}).then(() => id)
  }

  deleteDeck (id: string): Promise<string> {
    return this.deleteEntity(DECK_TABLE, {[ID_COLUMN]: id}).then(() => id)
  }

  deleteReview (id: string): Promise<string> {
    return this.deleteEntity(REVIEW_TABLE, {[ID_COLUMN]: id}).then(() => id)
  }

  findUser (id: string): Promise<User | void> {
    return this.findOne(USER_TABLE, {[ID_COLUMN]: id}).then(data => hydrateUser(data.Item))
  }

  findTemplate (id: string): Promise<Template | void> {
    return this.findOne(TEMPLATE_TABLE, {[ID_COLUMN]: id}).then(data => hydrateTemplate(data.Item))
  }

  findCard (id: string): Promise<Card | void> {
    return this.findOne(CARD_TABLE, {[ID_COLUMN]: id}).then(data => hydrateCard(data.Item))
  }

  findDeck (id: string): Promise<Deck | void> {
    return this.findOne(DECK_TABLE, {[ID_COLUMN]: id}).then(data => hydrateDeck(data.Item))
  }

  findReview (id: string): Promise<Review | void> {
    return this.findOne(REVIEW_TABLE, {[ID_COLUMN]: id}).then(data => hydrateReview(data.Item))
  }

  updateUser (user: User): Promise<User> {
    const id = user.id

    const updates = new Map()
    updates.set(EMAIL_INDEX, user.email)

    return this.updateEntity(id, user, USER_TABLE, updates)
  }

  updateTemplate (template: Template): Promise<Template> {
    const id = template.id

    const updates = new Map()
    updates.set(DECK_ID_INDEX, template.deckId)
    updates.set(TYPE_COLUMN, templateTypeToDBId(template.type))
    updates.set(FORMAT_COLUMN, formatTypeToDBId(template.format))
    updates.set(FIELD1_COLUMN, template.field1)
    updates.set(FIELD2_COLUMN, template.field2)

    return this.updateEntity(id, template, TEMPLATE_TABLE, updates)
  }

  updateCard (card: Card): Promise<Card> {
    const id = card.id

    const updates = new Map()
    updates.set(TEMPLATE_ID_INDEX, card.templateId)
    updates.set(CARD_NUMBER_COLUMN, card.cardNumber)
    updates.set(GOOD_INTERVAL_COLUMN, card.goodInterval)
    updates.set(DUE_COLUMN, card.due)

    return this.updateEntity(id, card, CARD_TABLE, updates)
  }

  updateDeck (deck: Deck): Promise<Deck> {
    const id = deck.id

    const updates = new Map()
    updates.set(USER_ID_COLUMN, deck.userId)
    updates.set(NAME_COLUMN, deck.name)

    return this.updateEntity(id, deck, DECK_TABLE, updates)
  }

  updateReview (review: Review): Promise<Review> {
    const id = review.id

    const updates = new Map()
    updates.set(CARD_ID_INDEX, review.cardId)
    updates.set(START_TIME_COLUMN, review.startTime)
    updates.set(END_TIME_COLUMN, review.endTime)
    updates.set(ANSWER_COLUMN, answerTypeToDBId(review.answer))

    return this.updateEntity(id, review, REVIEW_TABLE, updates)
  }

  createTable (name: string, indices: Array<IndexDefinition>): Promise<void> {

    const dynamodb = new AWS.DynamoDB()

    const keySchema = [
      {AttributeName: ID_COLUMN, KeyType: DYNAMODB_HASH}
    ]

    const additionalIndexDefinitions = indices.map((index: IndexDefinition) => {
      return {
        AttributeName: index.name,
        AttributeType: index.type
      }
    })
    const columnDefinitions = [
      {AttributeName: ID_COLUMN, AttributeType: DYNAMODB_STRING},
      ...additionalIndexDefinitions
    ]

    let params = {
      TableName: name,
      KeySchema: keySchema,
      AttributeDefinitions: columnDefinitions,
      ProvisionedThroughput: {
        ReadCapacityUnits: DEFAULT_READ_CAPACITY_UNITS,
        WriteCapacityUnits: DEFAULT_WRITE_CAPACITY_UNITS
      }
    }

    if (indices.length > 0) {
      params = {
        ...params,
        GlobalSecondaryIndexes: indices.map((column: IndexDefinition) => {
          return {
            IndexName: column.name,
            KeySchema: [
              {
                AttributeName: column.name,
                KeyType: DYNAMODB_HASH
              }
            ],
            Projection: {
              ProjectionType: DYNAMODB_PROJECT_ALL
            },
            ProvisionedThroughput: {
              'ReadCapacityUnits': DEFAULT_READ_CAPACITY_UNITS,
              'WriteCapacityUnits': 1
            }
          }
        })
      }
    }

    return new Promise((resolve, reject) => {
      dynamodb.createTable(params, (err, data) => {
        if (err) {
          console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2))
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  dropTable (name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: name
      }

      const dynamodb = new AWS.DynamoDB()

      dynamodb.deleteTable(params, (err, data) => {
        if (err) {
          console.error('Unable to drop table. Error JSON:', JSON.stringify(err, null, 2))
          reject(err)
        } else {
          resolve('Dropped table')
        }
      })
    })
  }

  insert (table: string, key: { [string]: string | number }, fields: { [string]: any }): Promise<any> {
    const docClient = new AWS.DynamoDB.DocumentClient()

    const item = Object.assign({}, key, fields)
    const params = {
      TableName: table,
      Item: item
    }

    return new Promise((resolve, reject) => {
      docClient.put(params, (err, data) => {
        if (err) {
          console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2))
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  updateEntity<Entity> (id: string, entity: Entity, table: string, updates: Map<string, any>): Promise<Entity> {
    if (id === NO_ID) {
      throw new Error(`Unable to update non-persisted ${table}!`)
    }

    return this.update(table, {[ID_COLUMN]: id}, [updates]).then(() => entity)
      .catch(err => {
        throw new Error(`Unable to update non-existent ${table}!`)
      })
  }

  update (table: string, key: { [string]: string }, fields: [Map<string, *>]): Promise<any> {
    const docClient = new AWS.DynamoDB.DocumentClient()

    const expressions = []
    const expressionValues = {}

    let fieldNum = 0
    for (let field of fields) {
      for (let [k, v] of field) {
        expressions.push(`${k} = :${fieldNum}`)
        expressionValues[`:${fieldNum++}`] = v
      }
    }

    const params = {
      TableName: table,
      Key: key,
      UpdateExpression: 'SET ' + expressions.join(','),
      ExpressionAttributeValues: expressionValues,
      ConditionExpression: `attribute_exists(${Object.keys(key)[0]})`,
    }

    return new Promise((resolve, reject) => {
      docClient.update(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  deleteEntity (table: string, key: { [string]: string | number }): Promise<any> {
    const docClient = new AWS.DynamoDB.DocumentClient()

    const params = {
      TableName: table,
      Key: key
    }

    return new Promise((resolve, reject) => {
      docClient.delete(params, (err, data) => {
        if (err) {
          console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2))
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  findOne (table: string, key: { [string]: string | number }): Promise<any> {
    const docClient = new AWS.DynamoDB.DocumentClient()

    const params = {
      TableName: table,
      Key: key,
      ConsistentRead: true
    }
    return new Promise((resolve, reject) => {
      docClient.get(params, (err, data) => {
        if (err) {
          console.error('Unable to read item. Error JSON:', JSON.stringify(err, null, 2))
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  findByIndexQuery (table: string, indexColumn: string, value: string) {
    const params = {
      TableName: table,
      IndexName: indexColumn,
      KeyConditionExpression: `${indexColumn} = :${indexColumn}`,
      ExpressionAttributeValues: {
        [`:${indexColumn}`]: value
      }
    }

    return new Promise((resolve, reject) => {
      const docClient = new AWS.DynamoDB.DocumentClient()

      docClient.query(params, (err, data) => {
        if (err) {
          console.log('Unable to query. Error:', JSON.stringify(err, null, 2))
          reject(err)
        } else {
          resolve(data.Items)
        }
      })
    })
  }

  async findReviewsByCardId (cardId: string): Promise<Array<Review>> {
    const items = await this.findByIndexQuery(REVIEW_TABLE, CARD_ID_INDEX, cardId)
    return items.map(hydrateReview)
  }

  async findDecksByUserId (userId: string): Promise<Array<Deck>> {
    const items = await this.findByIndexQuery(DECK_TABLE, USER_ID_INDEX, userId)
    return items.map(hydrateDeck)
  }

  async findCardsByDeckId (deckId: string): Promise<Array<Card>> {
    const templateItems = await this.findByIndexQuery(TEMPLATE_TABLE, DECK_ID_INDEX, deckId)
    const templateIds = templateItems.map(item => item[ID_COLUMN])
    // This returns an array of arrays
    const items = await Promise.all(templateIds.map(templateId => this.findByIndexQuery(CARD_TABLE, TEMPLATE_ID_INDEX, templateId)))
    return items.map(item => {
      return hydrateCard(item[0])
    })
  }

  async findCardsByTemplateId (templateId: string): Promise<Array<Card>> {
    const items = await this.findByIndexQuery(CARD_TABLE, TEMPLATE_ID_INDEX, templateId)
    return items.map(hydrateCard)
  }

  async findUserByEmail (email: string): Promise<User | void> {
    const items = await this.findByIndexQuery(USER_TABLE, EMAIL_INDEX, email)
    return items.length === 0 ? undefined : items[0]
  }
}