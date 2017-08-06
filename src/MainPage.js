import React, {Component} from 'react';
import './CollectionPage.css';
import CollectionPage from "./CollectionPage";
import ReviewPage from "./ReviewPage";

class MainPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let page = "CollectionPage" === this.props.page ?

            <CollectionPage collection={this.props.collection} reviewDeck={this.props.reviewDeck}
                            clock={this.props.clock} addDeck={this.props.addDeck}/> :

            <ReviewPage deck={this.props.deck} back={this.props.showCollections} clock={this.props.clock}/>;

        return (
            page
        );
    }
}

MainPage.propTypes = {
    // back: PropTypes.func.isRequired,
    // reviewDeck: PropTypes.func.isRequired
};

export default MainPage;
