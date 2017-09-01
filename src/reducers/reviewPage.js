//@flow
import type { Action, ReviewState } from '../actions/actionTypes'
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
import { MINUTES_PER_DAY, MINUTES_PER_HOUR } from '../services/APIDomain'
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
      const cards = action.cards
      const cardsForReview = cards
      let question = ''
      let answer = ''
      let format = state.format
      let cardId = ''
      let failInterval = ''
      let hardInterval = ''
      let goodInterval = ''
      let easyInterval = ''
      if (cardsForReview.length !== 0) {
        const forReview = cardsForReview[0]
        question = forReview.question
        answer = forReview.answer
        format = forReview.format
        cardId = forReview.id
        failInterval = userFriendlyInterval(forReview.failInterval)
        hardInterval = userFriendlyInterval(forReview.hardInterval)
        goodInterval = userFriendlyInterval(forReview.goodInterval)
        easyInterval = userFriendlyInterval(forReview.easyInterval)
      }

      return getViewState({
        ...state,
        dueCards: cards.filter(card => card.due !== DUE_IMMEDIATELY),
        newCards: cards.filter(card => card.due === DUE_IMMEDIATELY),
        question: question,
        answer: answer,
        format: format,
        cardId: cardId,
        failInterval: failInterval,
        hardInterval: hardInterval,
        goodInterval: goodInterval,
        easyInterval: easyInterval
      })
    case ADD_CARD_SUCCESS:
      const addedCard = action.card
      const reviewNewCard = state.question === ''
      const questionAfterAddCard = reviewNewCard ? addedCard.question : state.question
      const answerAfterAddCard = reviewNewCard ? addedCard.answer : state.answer
      const cardIdAfterAddCard = reviewNewCard ? addedCard.id : state.cardId
      const failIntervalAfterAddCard = reviewNewCard ? userFriendlyInterval(addedCard.failInterval) : state.failInterval
      const hardIntervalAfterAddCard = reviewNewCard ? userFriendlyInterval(addedCard.hardInterval) : state.hardInterval
      const goodIntervalAfterAddCard = reviewNewCard ? userFriendlyInterval(addedCard.goodInterval) : state.goodInterval
      const easyIntervalAfterAddCard = reviewNewCard ? userFriendlyInterval(addedCard.easyInterval) : state.easyInterval
      const formatAfterAddCard = reviewNewCard ? addedCard.format : state.format

      return getViewState({
        ...state,
        totalCount: state.totalCount + 1,
        newCards: [...state.newCards, addedCard],
        question: questionAfterAddCard,
        answer: answerAfterAddCard,
        format: formatAfterAddCard,
        cardId: cardIdAfterAddCard,
        failInterval: failIntervalAfterAddCard,
        hardInterval: hardIntervalAfterAddCard,
        goodInterval: goodIntervalAfterAddCard,
        easyInterval: easyIntervalAfterAddCard,
        showingAnswer: false
      })
    case ANSWER_CARD_SUCCESS:
      const reviewedCard = action.card
      const dueCardsMinusReviewed = state.dueCards.filter(card => card.id !== reviewedCard.id)
      const newCardsMinusReviewed = state.newCards.filter(card => card.id !== reviewedCard.id)
      const numDueCards = dueCardsMinusReviewed.length
      const numNewCards = newCardsMinusReviewed.length
      const doneReviewing = numDueCards === 0 && numNewCards === 0
      return getViewState({
        ...state,
        dueCards: dueCardsMinusReviewed,
        newCards: newCardsMinusReviewed,
        question: doneReviewing ? '' : numDueCards > 0 ? dueCardsMinusReviewed[0].question : newCardsMinusReviewed[0].question,
        answer: doneReviewing ? '' : numDueCards > 0 ? dueCardsMinusReviewed[0].answer : newCardsMinusReviewed[0].answer,
        format: doneReviewing ? state.format : numDueCards > 0 ? dueCardsMinusReviewed[0].format : newCardsMinusReviewed[0].format,
        cardId: doneReviewing ? '' : numDueCards > 0 ? dueCardsMinusReviewed[0].id : newCardsMinusReviewed[0].id,
        failInterval: doneReviewing ? '' : numDueCards > 0 ? userFriendlyInterval(dueCardsMinusReviewed[0].failInterval) : userFriendlyInterval(newCardsMinusReviewed[0].failInterval),
        hardInterval: doneReviewing ? '' : numDueCards > 0 ? userFriendlyInterval(dueCardsMinusReviewed[0].hardInterval) : userFriendlyInterval(newCardsMinusReviewed[0].failInterval),
        goodInterval: doneReviewing ? '' : numDueCards > 0 ? userFriendlyInterval(dueCardsMinusReviewed[0].goodInterval) : userFriendlyInterval(newCardsMinusReviewed[0].failInterval),
        easyInterval: doneReviewing ? '' : numDueCards > 0 ? userFriendlyInterval(dueCardsMinusReviewed[0].easyInterval) : userFriendlyInterval(newCardsMinusReviewed[0].failInterval),
        showingAnswer: false
      })
    case DELETE_CARD_SUCCESS:
      const dcs_dueCardsMinusReviewed = state.dueCards.filter(card => card.id !== state.cardId)
      const dcs_newCardsMinusReviewed = state.newCards.filter(card => card.id !== state.cardId)
      const dcs_numDueCards = dcs_dueCardsMinusReviewed.length
      const dcs_numNewCards = dcs_newCardsMinusReviewed.length
      const dcs_doneReviewing = dcs_numDueCards === 0 && dcs_numNewCards === 0
      return getViewState({
        ...state,
        totalCount: state.totalCount - 1,
        dueCards: dcs_dueCardsMinusReviewed,
        newCards: dcs_newCardsMinusReviewed,
        question: dcs_doneReviewing ? '' : dcs_numDueCards > 0 ? dcs_dueCardsMinusReviewed[0].question : dcs_newCardsMinusReviewed[0].question,
        answer: dcs_doneReviewing ? '' : dcs_numDueCards > 0 ? dcs_dueCardsMinusReviewed[0].answer : dcs_newCardsMinusReviewed[0].answer,
        format: dcs_doneReviewing ? state.format : dcs_numDueCards > 0 ? dcs_dueCardsMinusReviewed[0].format : dcs_newCardsMinusReviewed[0].format,
        cardId: dcs_doneReviewing ? '' : dcs_numDueCards > 0 ? dcs_dueCardsMinusReviewed[0].id : dcs_newCardsMinusReviewed[0].id,
        failInterval: dcs_doneReviewing ? '' : dcs_numDueCards > 0 ? userFriendlyInterval(dcs_dueCardsMinusReviewed[0].failInterval) : userFriendlyInterval(dcs_newCardsMinusReviewed[0].failInterval),
        hardInterval: dcs_doneReviewing ? '' : dcs_numDueCards > 0 ? userFriendlyInterval(dcs_dueCardsMinusReviewed[0].hardInterval) : userFriendlyInterval(dcs_newCardsMinusReviewed[0].failInterval),
        goodInterval: dcs_doneReviewing ? '' : dcs_numDueCards > 0 ? userFriendlyInterval(dcs_dueCardsMinusReviewed[0].goodInterval) : userFriendlyInterval(dcs_newCardsMinusReviewed[0].failInterval),
        easyInterval: dcs_doneReviewing ? '' : dcs_numDueCards > 0 ? userFriendlyInterval(dcs_dueCardsMinusReviewed[0].easyInterval) : userFriendlyInterval(dcs_newCardsMinusReviewed[0].failInterval),
        showingAnswer: false
      })
    case START_TIMER:
      return getViewState({
        ...state,
        startTime: action.time
      })
    default:
      return state
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