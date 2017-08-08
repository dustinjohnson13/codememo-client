import React, {Component} from 'react';
import {Button} from 'reactstrap';
import '../styles/ReviewPage.css';
import {EASY, FAIL, GOOD, HARD} from '../Domain'

class AnswerCard extends Component {
    constructor(props) {
        super(props);

        this.fail = this.fail.bind(this);
        this.hard = this.hard.bind(this);
        this.good = this.good.bind(this);
        this.easy = this.easy.bind(this);
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
