//@flow
import freeport from 'freeport'
import {CARD_TABLE, DECK_TABLE, USER_TABLE} from "../Dao"
import type {PreLoadedIds} from "../Dao.test"

const DynamoDbLocal = require('dynamodb-local')
const AWS = require("aws-sdk")
const fs = require('fs')

const TEST_DATA_DIR = './src/persist/testData'
const SAMPLE_DATA_JSON = `${TEST_DATA_DIR}/moviedata.json`

export const DYNAMODB_TEST_TIMEOUT = 20000
export const REGION = "us-east-1"
export const ACCESS_KEY_ID = 'noAccessKeyId'
export const SECRET_ACCESS_KEY = 'noSecretAccessKey'
export const SAMPLE_DATA_TABLE_NAME = "Movies"

export const startAndLoadData = (useSamples: boolean): Promise<number> => {
    return allocatePort()
        .then(port => startDynamoDB(port))
        .then(port => prepareAWSConfig(port))
        .then(port => createSampleTable(port, useSamples))
        .then(port => loadSampleData(port, useSamples))
        .catch((err) => {
            console.log("Error!")
            throw err
        })
}

export const stop = (port: number) => DynamoDbLocal.stop(port)

const allocatePort = () => {
    return new Promise((resolve, reject) => {
        freeport((err, port: number) => {
            if (err) {
                reject(err)
            } else {
                resolve(port)
            }
        })
    })
}

const startDynamoDB = (port: number) => {
    console.log(`Starting DynamoDB on port ${port}`)

    // DynamoDbLocal.configureInstaller({
    //     downloadUrl: './dynamodb-local-1.11.86.tar.gz'
    // });

    return DynamoDbLocal.launch(port, null, []).then(() => port)
}

const prepareAWSConfig = (port: number) => {
    const endpoint = `http://localhost:${port}`
    console.log(`DynamoDB ready at ${endpoint}.`)

    AWS.config.update({
        region: REGION,
        endpoint
    })

    return port
}

const createSampleTable = (port: number, loadSampleData: boolean) => {
    if (!loadSampleData) {
        return Promise.resolve(port)
    }

    return new Promise((resolve, reject) => {
        console.log("Creating sample data table.")

        const params = {
            TableName: SAMPLE_DATA_TABLE_NAME,
            KeySchema: [
                {AttributeName: "year", KeyType: "HASH"},  //Partition key
                {AttributeName: "title", KeyType: "RANGE"}  //Sort key
            ],
            AttributeDefinitions: [
                {AttributeName: "year", AttributeType: "N"},
                {AttributeName: "title", AttributeType: "S"}
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        }
        new AWS.DynamoDB().createTable(params, function (err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2))
                reject(err)
            } else {
                resolve(port)
            }
        })
    })
}

const loadSampleData = (port: number, loadSampleData: boolean) => {
    if (!loadSampleData) {
        return Promise.resolve(port)
    }

    console.log("Loading sample data.")

    const allMovies = JSON.parse(fs.readFileSync(SAMPLE_DATA_JSON, 'utf8'))
    const docClient = new AWS.DynamoDB.DocumentClient()

    const promises = allMovies.map((movie) => {
        const params = {
            TableName: SAMPLE_DATA_TABLE_NAME,
            Item: {
                "year": movie.year,
                "title": movie.title,
                "info": movie.info
            }
        }

        return new Promise((resolve, reject) => {
            docClient.put(params, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(port)
                }
            })
        })
    })

    return Promise.all(promises).then(() => port)
}

export const loadCollectionData = (port: number): Promise<PreLoadedIds> => {

    console.log("Loading collection data.")

    const toLoad = new Map()
    toLoad.set(USER_TABLE, `${TEST_DATA_DIR}/user.json`)
    toLoad.set(DECK_TABLE, `${TEST_DATA_DIR}/deck.json`)
    toLoad.set(CARD_TABLE, `${TEST_DATA_DIR}/card.json`)

    const docClient = new AWS.DynamoDB.DocumentClient()
    const promises = []

    toLoad.forEach((file, table) => {
        const content = JSON.parse(fs.readFileSync(file, 'utf8'))
        content.map((item) => {
            const params = {
                TableName: table,
                Item: item
            }

            promises.push(new Promise((resolve, reject) => {
                docClient.put(params, function (err, data) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(port)
                    }
                })
            }))
        })
    })


    return Promise.all(promises).then(() => {
            return {
                users: [
                    "d1eda90c-8413-11e7-bb31-be2e44b06b34"],
                decks: [
                    "ff2799fa-8413-11e7-bb31-be2e44b06b34",
                    "ff279d7e-8413-11e7-bb31-be2e44b06b34",
                    "ff279e8c-8413-11e7-bb31-be2e44b06b34",
                    "ff27a03a-8413-11e7-bb31-be2e44b06b34",
                ],
                cards: [
                    "7c7a263e-8414-11e7-bb31-be2e44b06b34",
                    "7c7a2c92-8414-11e7-bb31-be2e44b06b34",
                    "7c7a2ddc-8414-11e7-bb31-be2e44b06b34",
                    "7c7a2ef4-8414-11e7-bb31-be2e44b06b34",
                    "ede15e3c-8414-11e7-bb31-be2e44b06b34",
                    "ede160bc-8414-11e7-bb31-be2e44b06b34",
                    "ede16422-8414-11e7-bb31-be2e44b06b34",
                    "ede16512-8414-11e7-bb31-be2e44b06b34",
                    "f6226c9e-8414-11e7-bb31-be2e44b06b34",
                    "f62275ea-8414-11e7-bb31-be2e44b06b34",
                    "f6227856-8414-11e7-bb31-be2e44b06b34",
                    "f6227bda-8414-11e7-bb31-be2e44b06b34",
                    "019a7bb6-8415-11e7-bb31-be2e44b06b34",
                    "019a7fda-8415-11e7-bb31-be2e44b06b34",
                    "019a8278-8415-11e7-bb31-be2e44b06b34",
                    "019a835e-8415-11e7-bb31-be2e44b06b34",
                ]
            }
        }
    )
}