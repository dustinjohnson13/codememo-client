import React, {Component} from 'react';
import './App.css';
import * as domain from './Domain'
import LoadingPage from './LoadingPage'
import CollectionPageContainer from './containers/CollectionPageContainer'
import ReviewPageContainer from './containers/ReviewPageContainer'

const clock = new domain.Clock(() => new Date().getTime());

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const page = this.props.page === null ? <LoadingPage/> :
            "CollectionPage" === this.props.page ?
                <CollectionPageContainer clock={clock}/> :
                <ReviewPageContainer clock={clock}/>;

        return (
            <div className="App">
                <div className="App-header">
                    <h2>Flashcard App</h2>
                </div>
                {page}
            </div>
        );
    }
}

export default App;
