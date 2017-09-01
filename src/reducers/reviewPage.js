//@flow
import type {
  Action,
  AddCardSuccessAction,
  AnswerCardSuccessAction,
  DeleteCardSuccessAction,
  FetchCardsSuccessAction,
  ReviewState
} from '../actions/actionTypes'
import {
  ADD_CARD_SUCCESS,
  ANSWER_CARD_SUCCESS,
  DELETE_CARD_SUCCESS,
  FETCH_CARDS_SUCCESS,
  FETCH_DECK_SUCCESS,
  HIDE_ANSWER,
  LOAD_PAGE,
  SHOW_ANSWER,
  START_TIMER
} from '../actions/actionTypes'
import { CardDetail, MINUTES_PER_DAY, MINUTES_PER_HOUR } from '../services/APIDomain'
import { DUE_IMMEDIATELY, Format } from '../persist/Dao'

export const initialState = {
  dueCards: [],
  newCards: [],
  deckName: '',
  deckId: '',
  // TODO: Collapse cardId, question, answer into one field
  cardId: '',
  totalCount: 0,
  question: '',
  answer: '',
  format: Format.HTML,
  failInterval: '',
  hardInterval: '',
  goodInterval: '',
  easyInterval: '',
  showingAnswer: false,
  startTime: -1
}

export const getViewState = (state: ReviewState): ReviewState => state

const reviewPage = (state: ReviewState = initialState, action: Action) => {
  switch (action.type) {
    case LOAD_PAGE:
    case HIDE_ANSWER:
      return getViewState({
        ...state,
        showingAnswer: false
      })
    case SHOW_ANSWER:
      return getViewState({
        ...state,
        showingAnswer: true
      })
    case FETCH_DECK_SUCCESS:
      const deck = action.deck
      const totalCount = deck ? deck.cards.length : 0

      return getViewState({
        ...state,
        deckName: deck.name,
        deckId: deck.id,
        totalCount: totalCount

      })
    case FETCH_CARDS_SUCCESS:
      return getViewState(handleFetchCardsSuccess(state, action))
    case ADD_CARD_SUCCESS:
      return getViewState(handleAddCardSuccess(state, action))
    case ANSWER_CARD_SUCCESS:
      return getViewState(handleAnswerCardSuccess(state, action))
    case DELETE_CARD_SUCCESS:
      return getViewState(handleDeleteCardSuccess(state, action))
    case START_TIMER:
      return getViewState({
        ...state,
        startTime: action.time
      })
    default:
      return state
  }
}

const handleFetchCardsSuccess = (state: ReviewState, action: FetchCardsSuccessAction): ReviewState => {
  const cards = action.cards
  const dueCards = cards.filter(card => card.due !== DUE_IMMEDIATELY)
  const newCards = cards.filter(card => card.due === DUE_IMMEDIATELY)

  return updateCardReviewState({
    ...state,
    dueCards: dueCards,
    newCards: newCards
  })
}

const handleAddCardSuccess = (state: ReviewState, action: AddCardSuccessAction): ReviewState => {
  return updateCardReviewState({
    ...state,
    totalCount: state.totalCount + 1,
    newCards: [...state.newCards, action.card]
  })
}

const handleAnswerCardSuccess = (state: ReviewState, action: AnswerCardSuccessAction): ReviewState => {
  const reviewedCard = action.card
  const dueCards = state.dueCards.filter(card => card.id !== reviewedCard.id)
  const newCards = state.newCards.filter(card => card.id !== reviewedCard.id)

  return updateCardReviewState({
    ...state,
    dueCards: dueCards,
    newCards: newCards
  })
}

const handleDeleteCardSuccess = (state: ReviewState, action: DeleteCardSuccessAction): ReviewState => {
  const dueCards = state.dueCards.filter(card => card.id !== state.cardId)
  const newCards = state.newCards.filter(card => card.id !== state.cardId)

  return updateCardReviewState({
    ...state,
    totalCount: state.totalCount - 1,
    dueCards: dueCards,
    newCards: newCards
  })
}

const updateCardReviewState = (state: ReviewState): ReviewState => {
  const dueCards = state.dueCards
  const newCards = state.newCards
  const numDueCards = dueCards.length
  const numNewCards = newCards.length

  let question = ''
  let answer = ''
  let format = state.format
  let cardId = ''
  let failInterval = ''
  let hardInterval = ''
  let goodInterval = ''
  let easyInterval = ''

  const card: ?CardDetail = numDueCards > 0 ? dueCards[0] : numNewCards > 0 ? newCards[0] : undefined
  if (card) {
    question = card.question
    answer = card.answer
    format = card.format
    cardId = card.id
    failInterval = userFriendlyInterval(card.failInterval)
    hardInterval = userFriendlyInterval(card.hardInterval)
    goodInterval = userFriendlyInterval(card.goodInterval)
    easyInterval = userFriendlyInterval(card.easyInterval)
  }

  return {
    ...state,
    question: question,
    answer: answer,
    format: format,
    cardId: cardId,
    failInterval: failInterval,
    hardInterval: hardInterval,
    goodInterval: goodInterval,
    easyInterval: easyInterval,
    showingAnswer: false
  }
}

const userFriendlyInterval = (intervalMinutes: number): string => {
  let daysOrHours = intervalMinutes / MINUTES_PER_DAY
  let unit = 'd'
  if (daysOrHours < 1) {
    daysOrHours = intervalMinutes / MINUTES_PER_HOUR
    unit = 'h'
  }
  return Math.round(daysOrHours) + unit
}

export default reviewPage