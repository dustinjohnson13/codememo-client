import React, {Component} from 'react';
import Spinner from 'react-spin';

class LoadingPage extends Component {
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

export default LoadingPage;
