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

  constructor (props: Props) {
    super(props);

    (this: any).fail = this.fail.bind(this);
    (this: any).hard = this.hard.bind(this);
    (this: any).good = this.good.bind(this);
    (this: any).easy = this.easy.bind(this)
  };

  fail () {
    this.props.answerCard(Answer.FAIL)
  }

  hard () {
    this.props.answerCard(Answer.HARD)
  }

  good () {
    this.props.answerCard(Answer.GOOD)
  }

  easy () {
    this.props.answerCard(Answer.EASY)
  }

  render () {
    return (
      <div className="review-answers">
        <Button color="danger" onClick={this.fail}>{this.props.failInterval} </Button>
        <Button color="warning" onClick={this.hard}>{this.props.hardInterval}</Button>
        <Button color="info" onClick={this.good}>{this.props.goodInterval}</Button>
        <Button color="success" onClick={this.easy}>{this.props.easyInterval}</Button>
      </div>
    )
  }
}

export default AnswerCard
