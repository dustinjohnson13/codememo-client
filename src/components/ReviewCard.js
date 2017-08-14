//@flow
import React, {Component} from 'react';
import '../styles/ReviewPage.css';
import AnswerCardContainer from '../containers/AnswerCardContainer';
import {Button} from 'reactstrap';

type Props = {
    cardId: string,
    deckId: string,
    answer: string,
    question: string,
    showingAnswer: boolean,
    showAnswer: any
}

class ReviewCard extends Component<void, Props, void> {

    render() {
        const answerSection = this.props.showingAnswer ?
            <div>
                <div className="review-answer">{this.props.answer}</div>
                <AnswerCardContainer id={this.props.cardId} deckId={this.props.deckId}/>
            </div>
            : <Button className="show-answer" onClick={this.props.showAnswer}>Show Answer</Button>;

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
