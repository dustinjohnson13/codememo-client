import React, {Component} from 'react';
import './App.css';
import LoadingPage from './LoadingPage'
import CollectionPageContainer from './containers/CollectionPageContainer'
import ReviewPageContainer from './containers/ReviewPageContainer'

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const page = this.props.page === null ? <LoadingPage/> :
            "CollectionPage" === this.props.page ?
                <CollectionPageContainer/> :
                <ReviewPageContainer clock={this.props.clock}/>;

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
