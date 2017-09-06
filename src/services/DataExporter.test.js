//@flow
import {
  Card, Deck, DUE_IMMEDIATELY, Format, init, Review, Template, Templates, TEST_USER_EMAIL,
  User
} from '../persist/Dao'
import { FrozenClock } from './__mocks__/API'
import { InMemoryDao } from '../fakeData/InMemoryDao'
import { exportCollectionToJson, importCollectionFromJson } from './DataExporter'
import fs from 'fs'
import { Answer } from './APIDomain'

describe('DataExporter', () => {

  const clock = new FrozenClock()
  const dao = new InMemoryDao()

  let dbEntities

  beforeEach(async () => {
    dbEntities = await init(clock.epochMilliseconds(), dao, true)
  })

  it('can export collection as json', async () => {
    const expected = fs.readFileSync('src/fakeData/expectedExported.json', 'utf8')

    const actual = await exportCollectionToJson(dao, TEST_USER_EMAIL)

    expect(actual).toEqual(expected)
  })

  it('can import collection from json', async () => {
    const json = fs.readFileSync('src/fakeData/expectedExported.json', 'utf8')

    const actual = await importCollectionFromJson(json)

    expect(actual.users).toEqual([new User('1', TEST_USER_EMAIL)])

    expect(actual.decks).toEqual([new Deck('2', '1', 'Test Deck')])

    expect(actual.templates.length).toEqual(80)
    expect(actual.templates[0]).toEqual(new Template('3', '2', Templates.FRONT_BACK, Format.PLAIN, 'Question Number 0?', 'Answer Number 0'))
    expect(actual.templates[1]).toEqual(new Template('4', '2', Templates.FRONT_BACK, Format.HTML, '<strong>Question Number 1?</strong>', 'Answer Number 1'))
    expect(actual.templates[actual.templates.length - 1]).toEqual(new Template('82', '2', Templates.FRONT_BACK, Format.HTML, '<strong>Question Number 79?</strong>', 'Answer Number 79'))

    expect(actual.cards.length).toEqual(80)
    expect(actual.cards[0]).toEqual(new Card('83', '3', 1, 2880, 1451692800000))
    expect(actual.cards[1]).toEqual(new Card('84', '4', 1, 2880, 1451779200000))
    expect(actual.cards[actual.cards.length - 1]).toEqual(new Card('162', '82', 1, 1440, DUE_IMMEDIATELY))

    expect(actual.reviews).toEqual([
      new Review('163', '83', 1508271802, 1508331802, Answer.GOOD),
      new Review('164', '84', 1508271802, 1508331802, Answer.GOOD),
      new Review('165', '84', 1508271801, 1508331801, Answer.GOOD),
      new Review('166', '84', 1508271800, 1508331800, Answer.GOOD),
    ])
  })

})