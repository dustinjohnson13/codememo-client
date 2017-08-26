//@flow
import {
    ACCESS_KEY_ID,
    DYNAMODB_TEST_TIMEOUT,
    loadCollectionData,
    REGION,
    SECRET_ACCESS_KEY,
    startAndLoadData,
    stop
} from "./DynamoDBHelper"
import DynamoDBDao from "./DynamoDBDao"
import {Card, CARD_TABLE, Deck, DECK_TABLE, User, USER_TABLE} from "../Dao"
import type {PreLoadedIds} from "../Dao.test"
import {testWithDaoImplementation} from "../Dao.test"
import {testServiceWithDaoImplementation} from "../../services/DataService.test"

const AWS = require("aws-sdk")

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

    function getById(table: string, id: string): Promise<any> {
        const docClient = new AWS.DynamoDB.DocumentClient()

        const params = {
            TableName: table,
            Key: {
                "id": id
            }
        }

        return new Promise((resolve, reject) =>
            docClient.get(params, (err, data) => {
                if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2))
                } else {
                    resolve(data.Item)
                }
            }))
    }

    function loadDynamoDB(): Promise<PreLoadedIds> {
        return loadCollectionData(port)
    }

    function getDynamoDBUser(id: string): Promise<User | void> {
        return getById(USER_TABLE, id).then(item => item ? new User(item.id, item.email) : undefined)
    }

    function getDynamoDBDeck(id: string): Promise<Deck | void> {
        return getById(DECK_TABLE, id).then(item => item ? new Deck(item.id, item.uId, item.n) : undefined)
    }

    function getDynamoDBCard(id: string): Promise<Card | void> {
        return getById(CARD_TABLE, id).then(item => item ? new Card(item.id, item.dId, item.q, item.a, item.g, item.d) : undefined)
    }

    testWithDaoImplementation(() => dao, loadDynamoDB,
        getDynamoDBUser, getDynamoDBDeck, getDynamoDBCard)

    it('should be able to list tables', async () => {

        const tables = await dao.listTables()
        expect(tables).toEqual(["card", "deck", "user"])
    })

    testServiceWithDaoImplementation(() => dao)
})