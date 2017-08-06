import React, {Component} from 'react';
import './ReviewPage.css';
import Spinner from 'react-spin';

class ReviewPage extends Component {
    constructor(props) {
        super(props);
    }

    rawMarkup() {
        var spinner = new Spinner().spin();
        return {__html: spinner};
    }

    render() {
        var spinCfg = {
            width: 12,
            radius: 35
        };
        return <Spinner config={spinCfg} />
    }
}

export default ReviewPage;
