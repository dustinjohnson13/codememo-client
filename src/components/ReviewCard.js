//@flow
import React, { Component } from 'react'
import '../styles/ReviewPage.css'
import AnswerCardContainer from '../containers/AnswerCardContainer'
import { Button } from 'reactstrap'
import type { FormatType } from '../persist/Dao'
import { Format } from '../persist/Dao'

type Props = {
  +cardId: string,
  +deckId: string,
  +answer: string,
  +question: string,
  +format: FormatType,
  +showingAnswer: boolean,
  +showAnswer: () => void
}

class ReviewCard extends Component<Props, void> {

  render () {

    const plain = this.props.format === Format.PLAIN

    const questionSection = plain ? this.props.question : <div dangerouslySetInnerHTML={{__html: this.props.question}}/>

    const answerDisplay = plain ? this.props.answer : <div dangerouslySetInnerHTML={{__html: this.props.answer}}/>

    const answerSection = this.props.showingAnswer ? <div>
        <div className="review-answer">{answerDisplay}</div>
        <AnswerCardContainer id={this.props.cardId} deckId={this.props.deckId}/>
      </div>
      : <Button color="warning" className="show-answer" onClick={this.props.showAnswer}>Show Answer</Button>

    return (
      <div className="review-card">
        <div className="review-question">
          {questionSection}
        </div>

        {answerSection}
      </div>
    )
  }
}

export default ReviewCard
