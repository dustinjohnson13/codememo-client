//@flow
import React, { Component } from 'react'
import { Button } from 'reactstrap'
import '../styles/ReviewPage.css'
import { Answer } from '../services/APIDomain'

type Props = {
  +answerCard: (answer: string) => void,
  +failInterval: string,
  +hardInterval: string,
  +goodInterval: string,
  +easyInterval: string
};

class AnswerCard extends Component<Props, void> {

  render () {
    return (
      <div className="review-answers">
        <Button color="danger" onClick={() => this.props.answerCard(Answer.FAIL)}>{this.props.failInterval} </Button>
        <Button color="warning" onClick={() => this.props.answerCard(Answer.HARD)}>{this.props.hardInterval}</Button>
        <Button color="info" onClick={() => this.props.answerCard(Answer.GOOD)}>{this.props.goodInterval}</Button>
        <Button color="success" onClick={() => this.props.answerCard(Answer.EASY)}>{this.props.easyInterval}</Button>
      </div>
    )
  }
}

export default AnswerCard
