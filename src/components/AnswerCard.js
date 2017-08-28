//@flow
import React, {Component} from 'react'
import {Button} from 'reactstrap'
import '../styles/ReviewPage.css'
import type {AnswerType, Clock} from "../services/APIDomain"
import {Answer} from "../services/APIDomain"

type Props = {
    +answerCard: (startTime: number, endTime: number, answer: string) => void,
    +failInterval: string,
    +hardInterval: string,
    +goodInterval: string,
    +easyInterval: string,
    +startTime: number,
    +clock: Clock
};

class AnswerCard extends Component<Props, void> {

    constructor(props: Props) {
        super(props);

        (this: any).answer = this.answer.bind(this);
        (this: any).fail = this.fail.bind(this);
        (this: any).hard = this.hard.bind(this);
        (this: any).good = this.good.bind(this);
        (this: any).easy = this.easy.bind(this)
    };

    answer(answer: AnswerType) {
        const startTime = this.props.startTime
        const endTime = this.props.clock.epochSeconds()

        console.log("*** End time specified")
        console.log(startTime)
        console.log(endTime)
        console.log(`*** ${endTime - startTime} ms`)

        this.props.answerCard(startTime, endTime, answer)
    }

    fail() {
        this.answer(Answer.FAIL)
    }

    hard() {
        this.answer(Answer.HARD)
    }

    good() {
        this.answer(Answer.GOOD)
    }

    easy() {
        this.answer(Answer.EASY)
    }

    render() {
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
