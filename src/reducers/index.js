import { combineReducers } from 'redux'
import mainPage from './mainPage'
import visibilityFilter from './visibilityFilter'

const flashcardApp = combineReducers({
    mainPage,
    visibilityFilter
});

export default flashcardApp