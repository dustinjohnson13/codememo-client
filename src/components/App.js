//@flow
import React, {Component} from 'react';
import '../styles/App.css';
import LoadingPage from './LoadingPage'
import CollectionPageContainer from '../containers/CollectionPageContainer'
import ReviewPageContainer from '../containers/ReviewPageContainer'
import {Page} from "../actions/pages";

class App extends Component {
    render() {
        const requestedPage = this.props.page;
        let page = <LoadingPage nospin={this.props.nospin}/>;

        switch (requestedPage) {
            case Page.COLLECTION:
                page = <CollectionPageContainer/>;
                break;
            case Page.REVIEW:
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
