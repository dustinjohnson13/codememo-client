import React, {Component} from 'react';
import '../styles/App.css';
import LoadingPage from './LoadingPage'
import CollectionPageContainer from '../containers/CollectionPageContainer'
import ReviewPageContainer from '../containers/ReviewPageContainer'
import {COLLECTION, REVIEW} from "../actions/pages";

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const requestedPage = this.props.page;
        let page = <LoadingPage/>;

        switch (requestedPage) {
            case COLLECTION:
                page = <CollectionPageContainer/>;
                break;
            case REVIEW:
                page = <ReviewPageContainer/>;
                break;
            default:
        }

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
