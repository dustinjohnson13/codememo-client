//@flow
import {
  ACCESS_KEY_ID,
  DYNAMODB_TEST_TIMEOUT,
  loadCollectionData,
  REGION,
  SECRET_ACCESS_KEY,
  startAndLoadData,
  stop
} from './DynamoDBHelper'
import DynamoDBDao from './DynamoDBDao'
import {
  answerTypeFromDBId,
  Card,
  CARD_TABLE,
  Deck,
  DECK_TABLE,
  formatTypeFromDBId,
  Review,
  REVIEW_TABLE,
  Template,
  TEMPLATE_TABLE,
  templateTypeFromDBId,
  User,
  USER_TABLE
} from '../Dao'
import type { PreLoadedIds } from '../AbstractDao.test'
import { testWithDaoImplementation } from '../AbstractDao.test'
import { testServiceWithDaoImplementation } from '../../services/DataService.test'

const AWS = require('aws-sdk')

describe('DynamoDBDao', () => {
  let port
  let dao
  let originalTimeout

  beforeAll(async () => {
    await startAndLoadData(false).then((assignedPort: number) => {
      port = assignedPort
      dao = new DynamoDBDao(REGION, `http://localhost:${port}`, ACCESS_KEY_ID, SECRET_ACCESS_KEY)
    })
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
    jasmine.DEFAULT_TIMEOUT_INTERVAL = DYNAMODB_TEST_TIMEOUT
  })

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
    stop(port)
  })

  function getById (table: string, id: string): Promise<any> {
    const docClient = new AWS.DynamoDB.DocumentClient()

    const params = {
      TableName: table,
      Key: {
        'id': id
      }
    }

    return new Promise((resolve, reject) =>
      docClient.get(params, (err, data) => {
        if (err) {
          console.error('Unable to read item. Error JSON:', JSON.stringify(err, null, 2))
        } else {
          resolve(data.Item)
        }
      }))
  }

  function loadDynamoDB (): Promise<PreLoadedIds> {
    return loadCollectionData(port)
  }

  function getDynamoDBUser (id: string): Promise<User | void> {
    return getById(USER_TABLE, id).then(item => item ? new User(item.id, item.email) : undefined)
  }

  function getDynamoDBDeck (id: string): Promise<Deck | void> {
    return getById(DECK_TABLE, id).then(item => item ? new Deck(item.id, item.uId, item.n) : undefined)
  }

  function getDynamoDBTemplate (id: string): Promise<Template | void> {
    return getById(TEMPLATE_TABLE, id).then(item => item ? new Template(item.id, item.dId, templateTypeFromDBId(item.t), formatTypeFromDBId(item.f), item.f1, item.f2) : undefined)
  }

  function getDynamoDBCard (id: string): Promise<Card | void> {
    return getById(CARD_TABLE, id).then(item => item ? new Card(item.id, item.tId, item.n, item.g, item.d) : undefined)
  }

  function getDynamoDBReview (id: string): Promise<Review | void> {
    return getById(REVIEW_TABLE, id).then(item => item ? new Review(item.id, item.cId, item.st, item.et, answerTypeFromDBId(item.a)) : undefined)
  }

  testWithDaoImplementation(() => dao, loadDynamoDB,
    getDynamoDBUser, getDynamoDBDeck, getDynamoDBTemplate, getDynamoDBCard, getDynamoDBReview)

  it('should be able to list tables', async () => {

    const tables = await dao.listTables()
    expect(tables).toEqual([CARD_TABLE, DECK_TABLE, REVIEW_TABLE, TEMPLATE_TABLE, USER_TABLE])
  })

  testServiceWithDaoImplementation(() => dao)
})

describe('DynamoDBDao - No DB connection available', () => {

  it('should throw error when unable to perform db operations', async () => {

    expect.assertions(7)

    const errorDetails = 'Error listing tables!'
    const mock = {
      listTables: (params: any, callback: (err: any, data: any) => void) => {
        callback(errorDetails)
      },
      createTable: (params: any, callback: (err: any, data: any) => void) => {
        callback(errorDetails)
      },
      deleteTable: (params: any, callback: (err: any, data: any) => void) => {
        callback(errorDetails)
      },
      put: (params: any, callback: (err: any, data: any) => void) => {
        callback(errorDetails)
      },
      get: (params: any, callback: (err: any, data: any) => void) => {
        callback(errorDetails)
      },
      delete: (params: any, callback: (err: any, data: any) => void) => {
        callback(errorDetails)
      },
      query: (params: any, callback: (err: any, data: any) => void) => {
        callback(errorDetails)
      }
    }

    const dao = new DynamoDBDao(REGION, 'http://localhost:-1', 'accessKey', 'secretKey',
      () => mock, () => mock)

    await dao.listTables().catch(e => expect(e).toEqual(errorDetails))
    await dao.createTable('tablename', []).catch(e => expect(e).toEqual(errorDetails))
    await dao.dropTable('tablename').catch(e => expect(e).toEqual(errorDetails))
    await dao.insert('tablename', {'id': 'someId'}, {}).catch(e => expect(e).toEqual(errorDetails))
    await dao.deleteCard('id').catch(e => expect(e).toEqual(errorDetails))
    await dao.findCard('id').catch(e => expect(e).toEqual(errorDetails))
    await dao.findCardsByDeckId('id').catch(e => expect(e).toEqual(errorDetails))
  })

})