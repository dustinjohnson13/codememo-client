//@flow
import IndexDefinition from "./IndexDefinition"
import type {Dao} from "./Dao"
import {CARD_TABLE, COLLECTION_TABLE, DECK_TABLE, USER_TABLE} from "./Dao"
import User from "../entity/User"
import uuid from 'uuid'
import Card from "../entity/Card"
import Deck from "../entity/Deck"
import Collection from "../entity/Collection"

const AWS = require("aws-sdk")

const DEFAULT_READ_CAPACITY_UNITS = 5
const DEFAULT_WRITE_CAPACITY_UNITS = 5

export default class DynamoDBDao implements Dao {

    region: string
    endpoint: string

    constructor(region: string, endpoint: string) {
        this.region = region
        this.endpoint = endpoint

        AWS.config.update({
            region: this.region,
            endpoint: this.endpoint
        })
    }

    init(): Promise<void> {
        // Note: DynamoDB secondary indexes don't guarantee uniqueness
        return this.createTable(USER_TABLE, [new IndexDefinition("email", "string")])
            .then(() => this.createTable(CARD_TABLE, [new IndexDefinition("dId", "string")]))
            .then(() => this.createTable(DECK_TABLE, [new IndexDefinition("cId", "string")]))
            .then(() => this.createTable(COLLECTION_TABLE, [new IndexDefinition("uId", "string")]))
    }

    saveUser(user: User): Promise<User> {
        const id = uuid.v1()
        const fields = {"email": user.email}

        user.id = id

        return this.insert(USER_TABLE, {"id": id}, fields).then(() => Promise.resolve(user))
    }

    saveCard(card: Card): Promise<Card> {
        const id = uuid.v1()
        const fields: Object = {"q": card.question, "a": card.answer, "dId": card.deckId}
        if (card.due) {
            fields.d = card.due
        }

        card.id = id

        return this.insert(CARD_TABLE, {"id": id}, fields).then(() => Promise.resolve(card))
    }

    saveDeck(deck: Deck): Promise<Deck> {
        const id = uuid.v1()
        const fields: Object = {"n": deck.name, "cId": deck.collectionId}

        deck.id = id

        return this.insert(DECK_TABLE, {"id": id}, fields).then(() => Promise.resolve(deck))
    }

    saveCollection(collection: Collection): Promise<Collection> {
        const id = uuid.v1()
        const fields: Object = {"uId": collection.userId}

        collection.id = id

        return this.insert(COLLECTION_TABLE, {"id": collection.id}, fields).then(() => Promise.resolve(collection))
    }

    deleteUser(id: string): Promise<string> {
        return this.delete(USER_TABLE, {"id": id}).then(() => Promise.resolve(id))
    }

    deleteCard(id: string): Promise<string> {
        return this.delete(CARD_TABLE, {"id": id}).then(() => Promise.resolve(id))
    }

    deleteDeck(id: string): Promise<string> {
        return this.delete(DECK_TABLE, {"id": id}).then(() => Promise.resolve(id))
    }

    deleteCollection(id: string): Promise<string> {
        return this.delete(COLLECTION_TABLE, {"id": id}).then(() => Promise.resolve(id))
    }

    findUser(id: string): Promise<User> {
        return this.findOne(USER_TABLE, {"id": id}).then((data) =>
            Promise.resolve(new User(data.Item.id, data.Item.email))
        )
    }

    findCard(id: string): Promise<Card> {
        return this.findOne(CARD_TABLE, {"id": id}).then((data) =>
            Promise.resolve(new Card(data.Item.id, data.Item.dId, data.Item.q, data.Item.a, data.Item.d))
        )
    }

    findDeck(id: string): Promise<Deck> {
        return this.findOne(DECK_TABLE, {"id": id}).then((data) =>
            Promise.resolve(new Deck(data.Item.id, data.Item.cId, data.Item.n))
        )
    }

    findCollection(id: string): Promise<Collection> {
        return this.findOne(COLLECTION_TABLE, {"id": id}).then((data) =>
            Promise.resolve(new Collection(data.Item.id, data.Item.uId))
        )
    }

    updateUser(user: User): Promise<User> {
        const id = user.id

        const updates = new Map()
        updates.set("email", user.email)

        if (!id) {
            throw new Error("User must have id specified.")
        }

        return this.update(USER_TABLE, {"id": id}, [updates]).then(() => Promise.resolve(user))
    }

    updateCard(card: Card): Promise<Card> {
        const id = card.id

        if (!id) {
            throw new Error("Card must have id specified.")
        }

        const updates = new Map()
        updates.set("dId", card.deckId)
        updates.set("q", card.question)
        updates.set("a", card.answer)
        updates.set("d", card.due)

        return this.update(CARD_TABLE, {"id": id}, [updates]).then(() => Promise.resolve(card))
    }

    updateDeck(deck: Deck): Promise<Deck> {
        const id = deck.id

        if (!id) {
            throw new Error("Deck must have id specified.")
        }

        const updates = new Map()
        updates.set("cId", deck.collectionId)
        updates.set("n", deck.name)

        return this.update(DECK_TABLE, {"id": id}, [updates]).then(() => Promise.resolve(deck))
    }

    updateCollection(collection: Collection): Promise<Collection> {
        const id = collection.id

        const updates = new Map()
        updates.set("uId", collection.userId)

        // $FlowFixMe
        return this.update(COLLECTION_TABLE, {"id": id}, [updates]).then(() => Promise.resolve(collection))
    }

    createTable(name: string, indices: Array<IndexDefinition>): Promise<void> {

        const dynamodb = new AWS.DynamoDB()

        const keySchema = [
            {AttributeName: "id", KeyType: "HASH"}
        ]

        const additionalIndexDefinitions = indices.map((index: IndexDefinition) => {
            return {
                AttributeName: index.name,
                AttributeType: "string" === index.type ? "S" : 'N'
            }
        })
        const columnDefinitions = [
            {AttributeName: "id", AttributeType: "S"},
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
                            KeyType: "HASH"
                        }
                    ],
                    Projection: {
                        ProjectionType: "KEYS_ONLY"
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

    delete(table: string, key: { [string]: string | number }): Promise<any> {
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
            Key: key
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

    findDecksByCollectionId(collectionId: string): Promise<Array<Deck>> {
        const params = {
            TableName: DECK_TABLE,
            IndexName: "cId",
            KeyConditionExpression: "cId = :cId",
            ExpressionAttributeValues: {
                ":cId": collectionId
            }
        }

        const docClient = new AWS.DynamoDB.DocumentClient()

        return new Promise((resolve, reject) => {
            docClient.query(params, function (err, data) {
                if (err) {
                    console.log("Unable to query. Error:", JSON.stringify(err, null, 2))
                    reject(err)
                } else {
                    resolve(data.Items.map(i => i.id))
                }
            })
        }).then(ids => {
            return Promise.all(ids.map(i => this.findDeck(i)))
        })
    }

    findCardsByDeckId(deckId: string): Promise<Array<Card>> {
        const params = {
            TableName: CARD_TABLE,
            IndexName: "dId",
            KeyConditionExpression: "dId = :dId",
            ExpressionAttributeValues: {
                ":dId": deckId
            }
        }

        const docClient = new AWS.DynamoDB.DocumentClient()

        return new Promise((resolve, reject) => {
            docClient.query(params, function (err, data) {
                if (err) {
                    console.log("Unable to query. Error:", JSON.stringify(err, null, 2))
                    reject(err)
                } else {
                    resolve(data.Items.map(i => i.id))
                }
            })
        }).then(ids => {
            return Promise.all(ids.map(i => this.findCard(i)))
        })
    }

    // TODO: This needs to actually respect the email
    findCollectionByUserEmail(email: string): Promise<Collection> {
        const params = {
            TableName: USER_TABLE,
            IndexName: "email",
            KeyConditionExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email
            }
        }

        const docClient = new AWS.DynamoDB.DocumentClient()

        return new Promise((resolve, reject) => {
            docClient.query(params, function (err, data) {
                if (err) {
                    console.log("Unable to query. Error:", JSON.stringify(err, null, 2))
                    reject(err)
                } else {
                    resolve(data.Items.map(i => i.id)[0])
                }
            })
        }).then(userId => {
            const params = {
                TableName: COLLECTION_TABLE,
                IndexName: "uId",
                KeyConditionExpression: "uId = :uId",
                ExpressionAttributeValues: {
                    ":uId": userId
                }
            }

            return new Promise((resolve, reject) => {
                docClient.query(params, function (err, data) {
                    if (err) {
                        console.log("Unable to query. Error:", JSON.stringify(err, null, 2))
                        reject(err)
                    } else {
                        resolve(data.Items[0].id)
                    }
                })
            }).then(id => this.findCollection(id))
        })
    }
}