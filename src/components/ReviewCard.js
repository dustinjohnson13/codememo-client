//@flow
import React, {Component} from 'react';
import '../styles/ReviewPage.css';
import AnswerCardContainer from '../containers/AnswerCardContainer';
import {Button} from 'reactstrap';

type Props = {
    id: string,
    answer: string,
    question: string,
    answerCard: any
}

type State = {
    showingAnswer: boolean
}

class ReviewCard extends Component<void, Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            showingAnswer: false
        };

        (this: any).showAnswer = this.showAnswer.bind(this);
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
                <AnswerCardContainer id={this.props.id}/>
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
