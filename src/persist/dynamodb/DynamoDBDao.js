//@flow
import IndexDefinition from "./IndexDefinition"
import type {Dao} from "../Dao"
import {ALL_TABLES, CARD_TABLE, DECK_TABLE, USER_TABLE} from "../Dao"
import User from "../../entity/User"
import uuid from 'uuid'
import Card from "../../entity/Card"
import Deck from "../../entity/Deck"
import AWS from "aws-sdk"

const DYNAMODB_STRING = "S"
const DYNAMODB_HASH = "HASH"
const DYNAMODB_PROJECT_ALL = "ALL"

const DEFAULT_READ_CAPACITY_UNITS = 1
const DEFAULT_WRITE_CAPACITY_UNITS = 1

const ID_COLUMN = "id"
const NAME_COLUMN = "n"
const QUESTION_COLUMN = "q"
const ANSWER_COLUMN = "a"
const DECK_ID_COLUMN = "dId"
const USER_ID_COLUMN = "uId"
const GOOD_INTERVAL_COLUMN = "g"
const DUE_COLUMN = "d"

const EMAIL_INDEX = "email"
const DECK_ID_INDEX = "dId"
const USER_ID_INDEX = "uId"

const hydrateUser = (item) => {
    return new User(item[ID_COLUMN], item[EMAIL_INDEX])
}

const hydrateDeck = (item) => {
    return new Deck(item[ID_COLUMN], item[USER_ID_COLUMN], item[NAME_COLUMN])
}

const hydrateCard = (item) => {
    return new Card(item[ID_COLUMN], item[DECK_ID_COLUMN], item[QUESTION_COLUMN], item[ANSWER_COLUMN],
        item[GOOD_INTERVAL_COLUMN], item[DUE_COLUMN])
}

export default class DynamoDBDao implements Dao {

    region: string
    endpoint: string

    constructor(region: string, endpoint: string, accessKeyId: string, secretAccessKey: string) {
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

    init(clearDatabase: boolean): Promise<any> {
        // Note: DynamoDB secondary indexes don't guarantee uniqueness
        return this.listTables().then(tables => {
            if (tables.length === 0) {
                return this.createTables()
            } else {
                return (clearDatabase ? Promise.all(ALL_TABLES.map(table => this.dropTable(table))) :
                    Promise.resolve([])).then(() => this.createTables())
            }
        })
    }

    createTables(): Promise<void> {
        return this.createTable(USER_TABLE, [new IndexDefinition(EMAIL_INDEX, DYNAMODB_STRING)])
            .then(() => this.createTable(DECK_TABLE, [new IndexDefinition(USER_ID_INDEX, DYNAMODB_STRING)]))
            .then(() => this.createTable(CARD_TABLE, [new IndexDefinition(DECK_ID_INDEX, DYNAMODB_STRING)]))
    }

    listTables(): Promise<Array<string>> {
        const dynamodb = new AWS.DynamoDB()

        return new Promise((resolve, reject) => {
            dynamodb.listTables({Limit: 10}, function (err, data) {
                if (err) {
                    console.log("Error", err.code)
                    reject(err)
                } else {
                    resolve(data.TableNames)
                }
            });
        })
    }

    saveUser(user: User): Promise<User> {
        const id = uuid.v1()
        const fields = {[EMAIL_INDEX]: user.email}

        user.id = id

        return this.insert(USER_TABLE, {[ID_COLUMN]: id}, fields).then(() => user)
    }

    saveCard(card: Card): Promise<Card> {
        const id = uuid.v1()
        const fields: Object = {
            [QUESTION_COLUMN]: card.question,
            [ANSWER_COLUMN]: card.answer,
            [DECK_ID_INDEX]: card.deckId,
            [GOOD_INTERVAL_COLUMN]: card.goodInterval
        }
        if (card.due) {
            fields[DUE_COLUMN] = card.due
        }

        card.id = id

        return this.insert(CARD_TABLE, {[ID_COLUMN]: id}, fields).then(() => card)
    }

    saveDeck(deck: Deck): Promise<Deck> {
        const id = uuid.v1()
        const fields: Object = {[NAME_COLUMN]: deck.name, [USER_ID_INDEX]: deck.userId}

        deck.id = id

        return this.insert(DECK_TABLE, {[ID_COLUMN]: id}, fields).then(() => deck)
    }

    deleteUser(id: string): Promise<string> {
        return this.deleteEntity(USER_TABLE, {[ID_COLUMN]: id}).then(() => id)
    }

    deleteCard(id: string): Promise<string> {
        return this.deleteEntity(CARD_TABLE, {[ID_COLUMN]: id}).then(() => id)
    }

    deleteDeck(id: string): Promise<string> {
        return this.deleteEntity(DECK_TABLE, {[ID_COLUMN]: id}).then(() => id)
    }

    findUser(id: string): Promise<User> {
        return this.findOne(USER_TABLE, {[ID_COLUMN]: id}).then(data => hydrateUser(data.Item))
    }

    findCard(id: string): Promise<Card> {
        return this.findOne(CARD_TABLE, {[ID_COLUMN]: id}).then(data => hydrateCard(data.Item))
    }

    findDeck(id: string): Promise<Deck> {
        return this.findOne(DECK_TABLE, {[ID_COLUMN]: id}).then(data => hydrateDeck(data.Item))
    }

    updateUser(user: User): Promise<User> {
        const id = user.id

        const updates = new Map()
        updates.set(EMAIL_INDEX, user.email)

        if (!id) {
            throw new Error("User must have id specified.")
        }

        return this.update(USER_TABLE, {[ID_COLUMN]: id}, [updates]).then(() => user)
    }

    updateCard(card: Card): Promise<Card> {
        const id = card.id

        if (!id) {
            throw new Error("Card must have id specified.")
        }

        const updates = new Map()
        updates.set(DECK_ID_INDEX, card.deckId)
        updates.set(QUESTION_COLUMN, card.question)
        updates.set(ANSWER_COLUMN, card.answer)
        updates.set(GOOD_INTERVAL_COLUMN, card.goodInterval)
        updates.set(DUE_COLUMN, card.due)

        return this.update(CARD_TABLE, {[ID_COLUMN]: id}, [updates]).then(() => card)
    }

    updateDeck(deck: Deck): Promise<Deck> {
        const id = deck.id

        if (!id) {
            throw new Error("Deck must have id specified.")
        }

        const updates = new Map()
        updates.set(USER_ID_COLUMN, deck.userId)
        updates.set(NAME_COLUMN, deck.name)

        return this.update(DECK_TABLE, {[ID_COLUMN]: id}, [updates]).then(() => deck)
    }

    createTable(name: string, indices: Array<IndexDefinition>): Promise<void> {

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

        const params = {
            TableName: name,
            KeySchema: keySchema,
            AttributeDefinitions: columnDefinitions,
            ProvisionedThroughput: {
                ReadCapacityUnits: DEFAULT_READ_CAPACITY_UNITS,
                WriteCapacityUnits: DEFAULT_WRITE_CAPACITY_UNITS
            }
        }

        if (indices.length > 0) {
            // $FlowFixMe
            params["GlobalSecondaryIndexes"] = indices.map((column: IndexDefinition) => {
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
                        "ReadCapacityUnits": DEFAULT_READ_CAPACITY_UNITS,
                        "WriteCapacityUnits": 1
                    }
                }
            })
        }

        return new Promise((resolve, reject) => {
            dynamodb.createTable(params, function (err, data) {
                if (err) {
                    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2))
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }

    dropTable(name: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const params = {
                TableName: name
            }

            const dynamodb = new AWS.DynamoDB()

            dynamodb.deleteTable(params, function (err, data) {
                if (err) {
                    console.error("Unable to drop table. Error JSON:", JSON.stringify(err, null, 2))
                    reject(err)
                } else {
                    resolve("Dropped table")
                }
            })
        })
    }

    insert(table: string, key: { [string]: string | number }, fields: { [string]: any }): Promise<any> {
        const docClient = new AWS.DynamoDB.DocumentClient()

        const item = Object.assign({}, key, fields)
        const params = {
            TableName: table,
            Item: item
        }

        return new Promise((resolve, reject) => {
            docClient.put(params, function (err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2))
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }

    update(table: string, key: { [string]: string | number }, fields: [Map<string, *>]): Promise<any> {
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
            UpdateExpression: 'SET ' + expressions.join(","),
            ExpressionAttributeValues: expressionValues
        }

        return new Promise((resolve, reject) => {
            docClient.update(params, function (err, data) {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2))
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }

    deleteEntity(table: string, key: { [string]: string | number }): Promise<any> {
        const docClient = new AWS.DynamoDB.DocumentClient()

        const params = {
            TableName: table,
            Key: key
        }

        return new Promise((resolve, reject) => {
            docClient.delete(params, function (err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2))
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }

    findOne(table: string, key: { [string]: string | number }): Promise<any> {
        const docClient = new AWS.DynamoDB.DocumentClient()

        const params = {
            TableName: table,
            Key: key,
            ConsistentRead: true
        }
        return new Promise((resolve, reject) => {
            docClient.get(params, function (err, data) {
                if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2))
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }

    findByIndexQuery(table: string, indexColumn: string, value: string) {
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

            docClient.query(params, function (err, data) {
                if (err) {
                    console.log("Unable to query. Error:", JSON.stringify(err, null, 2))
                    reject(err)
                } else {
                    resolve(data.Items)
                }
            })
        })
    }

    findDecksByUserId(userId: string): Promise<Array<Deck>> {
        return this.findByIndexQuery(DECK_TABLE, USER_ID_INDEX, userId)
            .then(items => items.map(hydrateDeck))
    }

    findCardsByDeckId(deckId: string): Promise<Array<Card>> {
        return this.findByIndexQuery(CARD_TABLE, DECK_ID_INDEX, deckId)
            .then(items => items.map(hydrateCard))
    }

    findUserByEmail(email: string): Promise<User | void> {
        return this.findByIndexQuery(USER_TABLE, EMAIL_INDEX, email)
            .then(items => items.length === 0 ? undefined : items[0])
    }
}