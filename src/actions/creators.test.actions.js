//@flow
import {
  fetchCardsRequest,
  fetchCardsSuccess,
  fetchCollectionRequest,
  fetchCollectionSuccess,
  fetchDeckSuccess,
  reviewDeckRequest
} from './creators'

import { Format } from '../persist/Dao'

import {
  Card,
  CardDetail,
  CardDetailResponse,
  CollectionResponse,
  Deck,
  DeckResponse,
  MINUTES_PER_DAY,
  MINUTES_PER_FOUR_DAYS,
  MINUTES_PER_HALF_DAY,
  MINUTES_PER_TWO_DAYS
} from '../services/APIDomain'

export const deckId = 'deck-1'
export const deckName = 'Deck1'

export const getCollection = fetchCollectionRequest()
export const gotCollection = fetchCollectionSuccess(new CollectionResponse(
  [
    new Deck('deck-1', 'Deck1', 80, 27, 23),
    new Deck('deck-2', 'Deck2', 80, 27, 23),
    new Deck('deck-3', 'Deck3', 80, 27, 23),
    new Deck('deck-4', 'Deck4', 80, 27, 23),
    new Deck('deck-5', 'Deck5', 80, 27, 23),
    new Deck('deck-6', 'Deck6', 80, 27, 23)
  ]))

export const getDeck1 = reviewDeckRequest(deckName)
export const gotDeck1 = fetchDeckSuccess(new DeckResponse('deck-1', 'Deck1',
  [
    new Card('deck-1-card-0', 'OK'),
    new Card('deck-1-card-1', 'OK'),
    new Card('deck-1-card-2', 'OK'),
    new Card('deck-1-card-3', 'OK'),
    new Card('deck-1-card-4', 'OK'),
    new Card('deck-1-card-5', 'OK'),
    new Card('deck-1-card-6', 'OK'),
    new Card('deck-1-card-7', 'OK'),
    new Card('deck-1-card-8', 'OK'),
    new Card('deck-1-card-9', 'OK'),
    new Card('deck-1-card-10', 'OK'),
    new Card('deck-1-card-11', 'OK'),
    new Card('deck-1-card-12', 'OK'),
    new Card('deck-1-card-13', 'OK'),
    new Card('deck-1-card-14', 'OK'),
    new Card('deck-1-card-15', 'OK'),
    new Card('deck-1-card-16', 'OK'),
    new Card('deck-1-card-17', 'OK'),
    new Card('deck-1-card-18', 'OK'),
    new Card('deck-1-card-19', 'OK'),
    new Card('deck-1-card-20', 'OK'),
    new Card('deck-1-card-21', 'OK'),
    new Card('deck-1-card-22', 'OK'),
    new Card('deck-1-card-23', 'OK'),
    new Card('deck-1-card-24', 'OK'),
    new Card('deck-1-card-25', 'OK'),
    new Card('deck-1-card-26', 'OK'),
    new Card('deck-1-card-27', 'OK'),
    new Card('deck-1-card-28', 'OK'),
    new Card('deck-1-card-29', 'OK'),
    new Card('deck-1-card-30', 'DUE'),
    new Card('deck-1-card-31', 'DUE'),
    new Card('deck-1-card-32', 'DUE'),
    new Card('deck-1-card-33', 'DUE'),
    new Card('deck-1-card-34', 'DUE'),
    new Card('deck-1-card-35', 'DUE'),
    new Card('deck-1-card-36', 'DUE'),
    new Card('deck-1-card-37', 'DUE'),
    new Card('deck-1-card-38', 'DUE'),
    new Card('deck-1-card-39', 'DUE'),
    new Card('deck-1-card-40', 'DUE'),
    new Card('deck-1-card-41', 'DUE'),
    new Card('deck-1-card-42', 'DUE'),
    new Card('deck-1-card-43', 'DUE'),
    new Card('deck-1-card-44', 'DUE'),
    new Card('deck-1-card-45', 'DUE'),
    new Card('deck-1-card-46', 'DUE'),
    new Card('deck-1-card-47', 'DUE'),
    new Card('deck-1-card-48', 'DUE'),
    new Card('deck-1-card-49', 'DUE'),
    new Card('deck-1-card-50', 'DUE'),
    new Card('deck-1-card-51', 'DUE'),
    new Card('deck-1-card-52', 'DUE'),
    new Card('deck-1-card-53', 'DUE'),
    new Card('deck-1-card-54', 'DUE'),
    new Card('deck-1-card-55', 'DUE'),
    new Card('deck-1-card-56', 'DUE'),
    new Card('deck-1-card-57', 'NEW'),
    new Card('deck-1-card-58', 'NEW'),
    new Card('deck-1-card-59', 'NEW'),
    new Card('deck-1-card-60', 'NEW'),
    new Card('deck-1-card-61', 'NEW'),
    new Card('deck-1-card-62', 'NEW'),
    new Card('deck-1-card-63', 'NEW'),
    new Card('deck-1-card-64', 'NEW'),
    new Card('deck-1-card-65', 'NEW'),
    new Card('deck-1-card-66', 'NEW'),
    new Card('deck-1-card-67', 'NEW'),
    new Card('deck-1-card-68', 'NEW'),
    new Card('deck-1-card-69', 'NEW'),
    new Card('deck-1-card-70', 'NEW'),
    new Card('deck-1-card-71', 'NEW'),
    new Card('deck-1-card-72', 'NEW'),
    new Card('deck-1-card-73', 'NEW'),
    new Card('deck-1-card-74', 'NEW'),
    new Card('deck-1-card-75', 'NEW'),
    new Card('deck-1-card-76', 'NEW'),
    new Card('deck-1-card-77', 'NEW'),
    new Card('deck-1-card-78', 'NEW'),
    new Card('deck-1-card-79', 'NEW')]))

export const getDeck1DueCards = fetchCardsRequest(
  [
    'deck-1-card-30', 'deck-1-card-31', 'deck-1-card-32', 'deck-1-card-33',
    'deck-1-card-34', 'deck-1-card-35', 'deck-1-card-36', 'deck-1-card-37',
    'deck-1-card-38', 'deck-1-card-39', 'deck-1-card-40',
    'deck-1-card-41', 'deck-1-card-42', 'deck-1-card-43', 'deck-1-card-44',
    'deck-1-card-45', 'deck-1-card-46', 'deck-1-card-47', 'deck-1-card-48',
    'deck-1-card-49', 'deck-1-card-50', 'deck-1-card-51', 'deck-1-card-52',
    'deck-1-card-53', 'deck-1-card-54', 'deck-1-card-55', 'deck-1-card-56',
    'deck-1-card-57', 'deck-1-card-58', 'deck-1-card-59', 'deck-1-card-60',
    'deck-1-card-61', 'deck-1-card-62', 'deck-1-card-63', 'deck-1-card-64',
    'deck-1-card-65', 'deck-1-card-66', 'deck-1-card-67', 'deck-1-card-68',
    'deck-1-card-69', 'deck-1-card-70', 'deck-1-card-71', 'deck-1-card-72',
    'deck-1-card-73', 'deck-1-card-74', 'deck-1-card-75', 'deck-1-card-76',
    'deck-1-card-77', 'deck-1-card-78', 'deck-1-card-79'
  ])

export const cardDetailResponse = new CardDetailResponse([
  new CardDetail('deck-1-card-30',
    'Question Number 30?',
    'Answer Number 30',
    Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS,
    MINUTES_PER_FOUR_DAYS,
    -299999
  ),
  new CardDetail('deck-1-card-31',
    'Question Number 31?',
    'Answer Number 31',
    Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS,
    MINUTES_PER_FOUR_DAYS,
    -309999
  ),
  new CardDetail('deck-1-card-32',
    'Question Number 32?',
    'Answer Number 32',
    Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS,
    MINUTES_PER_FOUR_DAYS,
    -319999
  ),
  new CardDetail('deck-1-card-33',
    'Question Number 33?',
    'Answer Number 33',
    Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS,
    MINUTES_PER_FOUR_DAYS,
    -329999
  ),
  new CardDetail('deck-1-card-34',
    'Question Number 34?',
    'Answer Number 34',
    Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS,
    MINUTES_PER_FOUR_DAYS,
    -339999
  ),
  new CardDetail('deck-1-card-35',
    'Question Number 35?',
    'Answer Number 35',
    Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS,
    MINUTES_PER_FOUR_DAYS,
    -349999
  ),
  new CardDetail('deck-1-card-36',
    'Question Number 36?',
    'Answer Number 36',
    Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS,
    MINUTES_PER_FOUR_DAYS,
    -359999
  ),
  new CardDetail('deck-1-card-37',
    'Question Number 37?',
    'Answer Number 37',
    Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS,
    MINUTES_PER_FOUR_DAYS,
    -369999
  ),
  new CardDetail('deck-1-card-38',
    'Question Number 38?',
    'Answer Number 38',
    Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS,
    MINUTES_PER_FOUR_DAYS,
    -379999
  ),
  new CardDetail('deck-1-card-39',
    'Question Number 39?',
    'Answer Number 39',
    Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS,
    MINUTES_PER_FOUR_DAYS,
    -389999
  )])

export const gotDeck1DueCards = fetchCardsSuccess(cardDetailResponse)