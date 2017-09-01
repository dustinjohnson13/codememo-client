//@flow
import { combineReducers } from 'redux'
import app from './app'
import collectionPage from './collectionPage'
import reviewPage from './reviewPage'

const flashcardApp = combineReducers({
  app,
  collection: collectionPage,
  review: reviewPage
})

export default flashcardApp