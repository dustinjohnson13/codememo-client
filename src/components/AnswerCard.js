//@flow
import React, {Component} from 'react';
import {Button} from 'reactstrap';
import '../styles/ReviewPage.css';
import {EASY, FAIL, GOOD, HARD} from '../services/APIDomain'

type Foo = {
    answerCard: any,
    failInterval: string,
    hardInterval: string,
    goodInterval: string,
    easyInterval: string
};

class AnswerCard extends Component {

    constructor(props: Foo) {
        super(props);

        (this: any).fail = this.fail.bind(this);
        (this: any).hard = this.hard.bind(this);
        (this: any).good = this.good.bind(this);
        (this: any).easy = this.easy.bind(this);
    };

    fail() {
        this.props.answerCard(FAIL)
    }

    hard() {
        this.props.answerCard(HARD)
    }

    good() {
        this.props.answerCard(GOOD)
    }

    easy() {
        this.props.answerCard(EASY)
    }

    render() {
        return (
            <div className="review-answers">
                <Button color="danger" onClick={this.fail}>{this.props.failInterval} </Button>
                <Button color="warning" onClick={this.hard}>{this.props.hardInterval}</Button>
                <Button color="info" onClick={this.good}>{this.props.goodInterval}</Button>
                <Button color="success" onClick={this.easy}>{this.props.easyInterval}</Button>
            </div>
        );
    }
}

export default AnswerCard;
