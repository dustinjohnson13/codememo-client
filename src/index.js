import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App';
import flashcardApp from './reducers/index'
import './index.css';
import registerServiceWorker from './registerServiceWorker';

let store = createStore(flashcardApp);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
