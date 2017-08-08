import React, {Component} from 'react';
import '../styles/ReviewPage.css';
import AnswerCardContainer from '../containers/AnswerCardContainer';

class ReviewCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="review-card">
                <div className="review-question">
                    What is the capital of Peru?
                </div>
                <div className="review-answer">
                    Lima
                </div>
                <AnswerCardContainer/>
            </div>
        );
    }
}

export default ReviewCard;
