import React, {Component} from 'react';
import {Button} from 'reactstrap';
import '../styles/ReviewPage.css';
import ReviewCard from "./ReviewCard";

class ReviewPage extends Component {
    render() {
        return (
            <div>
                <div className="menu">
                    <a className="back" onClick={this.props.back}>&lt;&nbsp;Back</a>
                    <Button>Add</Button><Button>Edit</Button><Button>Find</Button>
                    <a className="tools">Tools</a>
                </div>
                <h3>{this.props.deckName}</h3>
                <h5>{this.props.totalCount} cards (
                    <span className="due-count">{this.props.dueCount}</span> due,
                    <span className="new-count">{this.props.newCount}</span> new)</h5>

                <ReviewCard question={this.props.question} answer={this.props.answer}
                            answerCard={this.props.answerCard} id={this.props.id}/>
            </div>
        );
    }
}

export default ReviewPage;
