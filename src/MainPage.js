import React, {Component} from 'react';
import './CollectionPage.css';
import CollectionPage from "./CollectionPage";
import ReviewPage from "./ReviewPage";
import PropTypes from 'prop-types'

class MainPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {



        return (
            page
        );
    }
}

MainPage.propTypes = {
    back: PropTypes.func.isRequired,
    reviewDeck: PropTypes.func.isRequired
};

export default MainPage;