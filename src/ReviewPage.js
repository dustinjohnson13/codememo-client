import React, {Component} from 'react';
// import './ReviewPage.css';

class ReviewPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                Review Page ({this.props.deck.name})
            </div>
        );
    }
}

export default ReviewPage;
