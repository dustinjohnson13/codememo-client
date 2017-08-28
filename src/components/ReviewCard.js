//@flow
import React, {Component} from 'react'
import '../styles/ReviewPage.css'
import AnswerCardContainer from '../containers/AnswerCardContainer'
import {Button} from 'reactstrap'
import type {Clock} from "../services/APIDomain"

type Props = {
    +cardId: string,
    +deckId: string,
    +answer: string,
    +question: string,
    +showingAnswer: boolean,
    +showAnswer: () => void,
    +clock: Clock
};

type State = {
    startTime: number
}

class ReviewCard extends Component<Props, State> {

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.question !== this.props.question) {
            console.log("*** Start time specified")
            this.setState({startTime: this.props.clock.epochSeconds()});
        }
    }

    render() {
        const answerSection = this.props.showingAnswer ?
            <div>
                <div className="review-answer">{this.props.answer}</div>
                <AnswerCardContainer id={this.props.cardId} deckId={this.props.deckId} clock={this.props.clock} startTime={this.state.startTime}/>
            </div>
            : <Button color="warning" className="show-answer" onClick={this.props.showAnswer}>Show Answer</Button>

        return (
            <div className="review-card">
                <div className="review-question">
                    {this.props.question}
                </div>

                {answerSection}
            </div>
        )
    }
}

export default ReviewCard
