import React, {Component} from 'react';
import '../styles/ReviewPage.css';
import AnswerCardContainer from '../containers/AnswerCardContainer';
import {Button} from 'reactstrap';

class ReviewCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
           showingAnswer: false
        };

        this.showAnswer = this.showAnswer.bind(this);
    }

    showAnswer() {
        this.setState({
            showingAnswer: !this.state.showingAnswer
        });
    }

    render() {
        const answerSection = this.state.showingAnswer ?
            <div>
                <div className="review-answer">{this.props.answer}</div>
                < AnswerCardContainer/>
            </div>
            : <Button className="show-answer" onClick={this.showAnswer}>Show Answer</Button>;

        return (
            <div className="review-card">
                <div className="review-question">
                    {this.props.question}
                </div>

                {answerSection}
            </div>
        );
    }
}

export default ReviewCard;
