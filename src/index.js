// import 'babel-polyfill'
import thunkMiddleware from 'redux-thunk'
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {createLogger} from 'redux-logger'
import {applyMiddleware, createStore} from 'redux'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App';
import flashcardApp from './reducers/index'
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import {fetchCollection} from "./actions/index";

const loggerMiddleware = createLogger();

let store = createStore(flashcardApp, applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
));

store.dispatch(fetchCollection());

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
