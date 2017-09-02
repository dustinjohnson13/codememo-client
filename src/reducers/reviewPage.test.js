//@flow
import reviewPage, { initialState } from './reviewPage'
import {
  addCardSuccess,
  answerCardSuccess,
  deleteCardSuccess,
  fetchCardsSuccess,
  fetchCollectionSuccess,
  fetchDeckSuccess,
  hideAnswer,
  loadPage,
  showAnswer,
  startTimer,
  updateCardSuccess
} from '../actions/creators'
import {
  Card,
  CardDetail,
  CardDetailResponse,
  CardStatus,
  CollectionResponse,
  DeckResponse,
  MINUTES_PER_DAY,
  MINUTES_PER_FOUR_DAYS,
  MINUTES_PER_HALF_DAY,
  MINUTES_PER_TWO_DAYS
} from '../services/APIDomain'
import { DUE_IMMEDIATELY, Format } from '../persist/Dao'
import { Page } from '../actions/pages'

describe('reviewPage', () => {

  const expectedDeckName = 'My Deck'
  const expectedDeckID = 'deck1'

  const cards = [new Card('deck-1-card-32', CardStatus.NEW),
    new Card('deck-1-card-30', CardStatus.DUE), new Card('deck-1-card-31', CardStatus.DUE),
    new Card('5', CardStatus.OK), new Card('6', CardStatus.OK)]
  const deck = new DeckResponse(expectedDeckID, expectedDeckName, cards)

  const addCardResponse = new CardDetail('deck-1-card-99', 'Some Question', 'Some Answer', Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, DUE_IMMEDIATELY)

  const currentlyReviewing = {
    ...initialState,
    format: Format.PLAIN,
    answer: 'Answer Number 30',
    question: 'Question Number 30?',
    cardId: 'deck-1-card-30',
    totalCount: 5,
    dueCards: [new CardDetail(
      'deck-1-card-30',
      'Question Number 30?',
      'Answer Number 30',
      Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS,
      -299999
    ), new CardDetail('deck-1-card-31',
      'Question Number 31?',
      'Answer Number 31',
      Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS,
      -309999
    )],
    newCards: [
      new CardDetail('deck-1-card-32',
        'Question Number 32?',
        'Answer Number 32',
        Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS,
        DUE_IMMEDIATELY)
    ],
    showingAnswer: true
  }

  it('adds new card on add card success', () => {

    const response = addCardResponse

    const previousState = {
      ...initialState,
      totalCount: 5,
      dueCards: [
        new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, -299999),
        new CardDetail('deck-1-card-31', 'Question Number 31?', 'Answer Number 31', Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, -309999)
      ],
      newCards: [
        new CardDetail('deck-1-card-32', 'Question Number 32?', 'Answer Number 32', Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, DUE_IMMEDIATELY)
      ]
    }

    const expectedDueCards = previousState.dueCards
    const expectedNewCards = [...previousState.newCards, response]

    const action = addCardSuccess(response, 'deck-1')
    const actualState = reviewPage(previousState, action)

    expect(actualState.totalCount).toEqual(6)
    expect(actualState.dueCards).toEqual(expectedDueCards)
    expect(actualState.newCards).toEqual(expectedNewCards)
  })

  it('adds question/answer/format/id for added card if there are no cards for review', () => {

    const response = addCardResponse

    const previousState = {
      ...initialState,
      question: '',
      answer: '',
      format: Format.HTML,
      dueCards: [],
      newCards: []
    }

    const action = addCardSuccess(response, 'deck-1')
    const actualState = reviewPage(previousState, action)

    expect(actualState.question).toEqual(response.question)
    expect(actualState.answer).toEqual(response.answer)
    expect(actualState.format).toEqual(response.format)
    expect(actualState.cardId).toEqual(response.id)
    expect(actualState.failInterval).toEqual('12h')
    expect(actualState.hardInterval).toEqual('1d')
    expect(actualState.goodInterval).toEqual('2d')
    expect(actualState.easyInterval).toEqual('4d')
  })

  it('updates question/answer/format for updated card', () => {

    const response = addCardResponse

    const previousState = {
      ...initialState,
      question: 'Original Question',
      answer: 'Original Answer',
      format: Format.HTML
    }

    const expectedState = {
      ...previousState,
      question: response.question,
      answer: response.answer,
      format: response.format
    }

    const action = updateCardSuccess(response, 'deck-1')
    const actualState = reviewPage(previousState, action)

    expect(actualState).toEqual(expectedState)
  })

  it('hides answer after adding card', () => {

    const response = addCardResponse

    const previousState = {
      ...initialState,
      dueCards: [],
      newCards: [],
      showingAnswer: true
    }

    const action = addCardSuccess(response, 'deck-1')
    const actualState = reviewPage(previousState, action)

    expect(actualState.showingAnswer).toEqual(false)
  })

  it('hides answer on load page', () => {

    const response = addCardResponse

    const previousState = {
      ...initialState,
      dueCards: [],
      newCards: [],
      showingAnswer: true
    }

    const action = loadPage(Page.COLLECTION)
    const actualState = reviewPage(previousState, action)

    expect(actualState.showingAnswer).toEqual(false)
  })

  it('hides answer when requested', () => {

    const previousState = {
      ...initialState,
      showingAnswer: true
    }

    const action = hideAnswer()
    const actualState = reviewPage(previousState, action)

    expect(actualState.showingAnswer).toEqual(false)
  })

  it('shows answer when requested', () => {

    const previousState = {
      ...initialState,
      showingAnswer: false
    }

    const action = showAnswer()
    const actualState = reviewPage(previousState, action)

    expect(actualState.showingAnswer).toEqual(true)
  })

  it('adds deck information on fetch deck success', () => {

    const previousState = {...initialState}
    // TODO: Breakup the deck instance
    const expectedState =
      {
        ...previousState,
        deckName: expectedDeckName, deckId: expectedDeckID,
        totalCount: 5
      }

    const action = fetchDeckSuccess(deck)
    const actualState = reviewPage(previousState, action)

    expect(actualState).toEqual(expectedState)
  })

  it('adds question, answer, answer intervals, and cards for review on fetch cards success', () => {

    const cardDetails = [new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, -299999),
      new CardDetail('deck-1-card-31', 'Question Number 31?', 'Answer Number 31', Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, -309999),
      new CardDetail('deck-1-card-32', 'Question Number 32?', 'Answer Number 32', Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, DUE_IMMEDIATELY)]
    const cardsResponse = new CardDetailResponse(cardDetails)

    const previousState = {...initialState}
    const expectedState = {
      ...previousState,
      dueCards: [
        new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, -299999),
        new CardDetail('deck-1-card-31', 'Question Number 31?', 'Answer Number 31', Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, -309999)
      ],
      newCards: [
        new CardDetail('deck-1-card-32', 'Question Number 32?', 'Answer Number 32', Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, DUE_IMMEDIATELY)
      ],
      format: Format.PLAIN,
      answer: 'Answer Number 30',
      question: 'Question Number 30?',
      cardId: 'deck-1-card-30',
      failInterval: '12h',
      hardInterval: '1d',
      goodInterval: '2d',
      easyInterval: '4d'
    }

    const action = fetchCardsSuccess(cardsResponse)
    const actualState = reviewPage(previousState, action)

    expect(actualState).toEqual(expectedState)
  })

  it('resets answer card state on answer card, delete card', () => {

    const expectedDueCards = currentlyReviewing.dueCards.slice(1)

    const expectedCommonState = {
      ...currentlyReviewing,
      answer: 'Answer Number 31',
      question: 'Question Number 31?',
      failInterval: '12h',
      hardInterval: '1d',
      goodInterval: '2d',
      easyInterval: '4d',
      cardId: 'deck-1-card-31',
      dueCards: expectedDueCards,
      showingAnswer: false
    }

    const actions = [
      answerCardSuccess(new CardDetail('deck-1-card-30', 'Question Number 30?', 'Answer Number 30', Format.PLAIN, MINUTES_PER_HALF_DAY, MINUTES_PER_DAY, MINUTES_PER_TWO_DAYS, MINUTES_PER_FOUR_DAYS, 86400), 'deck-1'),
      deleteCardSuccess('deck-1-card-30', new DeckResponse('deck-1', 'Deck 1', []))
    ]
    const expectedStates = [
      {...expectedCommonState, totalCount: 5},
      {...expectedCommonState, totalCount: 4}
    ]

    actions.forEach((action, idx) => {
      const actualState = reviewPage(currentlyReviewing, action)
      expect(actualState).toEqual(expectedStates[idx])
    })
  })

  it('starts timer when requested', () => {

    const previousState = {
      ...initialState,
      startTime: -1
    }

    const action = startTimer()
    const actualState = reviewPage(previousState, action)

    expect(actualState.startTime).toBeGreaterThan(0)
  })

  it('returns state without change on unsupported action', () => {

    const action = fetchCollectionSuccess(new CollectionResponse([]))
    const actualState = reviewPage(initialState, action)

    expect(actualState).toEqual(initialState)
  })

})