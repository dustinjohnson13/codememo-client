import {combineReducers} from 'redux'
import collectionPage from './collectionPage'
import reviewPage from './reviewPage'

const flashcardApp = combineReducers({
    collectionPage,
    reviewPage
});

export default flashcardApp