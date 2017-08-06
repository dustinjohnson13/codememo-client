import React, {Component} from 'react';
import './App.css';
import MainPageContainer from './containers/MainPageContainer'

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h2>Flashcard App</h2>
                </div>
                <MainPageContainer/>

            </div>
        );
    }
}

export default App;
