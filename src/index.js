// import 'babel-polyfill'
import thunkMiddleware from 'redux-thunk'
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {createLogger} from 'redux-logger'
import {applyMiddleware, createStore} from 'redux'
import 'bootstrap/dist/css/bootstrap.css'
import AppContainer from './containers/AppContainer';
import flashcardApp from './reducers/index'
import './styles/index.css';
import registerServiceWorker from './registerServiceWorker';
import {fetchCollection} from "./actions/index";
import {Clock} from './Domain'
import DataService from './services/DataService';

const loggerMiddleware = createLogger();

let store = createStore(flashcardApp, applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
));

const clock = new Clock(() => new Date().getTime());
const dataService = new DataService(clock);

store.dispatch(fetchCollection(dataService));

ReactDOM.render(
    <Provider store={store}>
        <AppContainer dataService={dataService}/>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
