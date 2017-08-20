//@flow
import createSagaMiddleware from 'redux-saga'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createLogger} from 'redux-logger'
import {applyMiddleware, createStore} from 'redux'
import 'bootstrap/dist/css/bootstrap.css'
import AppContainer from './containers/AppContainer'
import flashcardApp from './reducers/index'
import './styles/index.css'
import registerServiceWorker from './registerServiceWorker'
import {collectionPage, saga} from "./actions/creators"

const sagaMiddleware = createSagaMiddleware()
const loggerMiddleware = createLogger()

let store = createStore(flashcardApp, applyMiddleware(
    sagaMiddleware,
    loggerMiddleware // neat middleware that logs actions
))

sagaMiddleware.run(saga)
store.dispatch(collectionPage())

ReactDOM.render(
    <Provider store={store}>
        <AppContainer/>
    </Provider>,
    document.getElementById('root')
)
registerServiceWorker()
