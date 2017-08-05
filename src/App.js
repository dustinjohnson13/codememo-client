import React, {Component} from 'react';
import CollectionPage from './CollectionPage'
import './App.css';

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

                <CollectionPage/>

            </div>
        );
    }
}

export default App;
