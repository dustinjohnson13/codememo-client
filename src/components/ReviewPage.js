//@flow
import React, {Component} from 'react';
import {Button} from 'reactstrap';
import '../styles/ReviewPage.css';
import ReviewCard from "./ReviewCard";
import AddCardModal from "./AddCardModal";

class ReviewPage extends Component {
    props: {
        id: string,
        back: any,
        deckName: string,
        totalCount: number,
        dueCount: number,
        newCount: number,
        question: string,
        answer: string,
        answerCard: any,
        addCard: any
    };

    render() {
        const reviewSection = (this.props.question === '') ? <div>Congratulations, you're caught up!</div> :
            <ReviewCard question={this.props.question} answer={this.props.answer}
                        answerCard={this.props.answerCard} id={this.props.id}/>;
        return (
            <div>
                <div className="menu">
                    <a className="back" onClick={this.props.back}>&lt;&nbsp;Back</a>
                    <AddCardModal deckId='deck-1' addCard={this.props.addCard}/>
                    <Button>Edit</Button><Button>Find</Button>
                    <a className="tools">Tools</a>
                </div>
                <h3>{this.props.deckName}</h3>
                <h5>{this.props.totalCount} cards (
                    <span className="due-count">{this.props.dueCount}</span> due,&nbsp;
                    <span className="new-count">{this.props.newCount}</span> new)</h5>

                {reviewSection}
            </div>
        );
    }
}

export default ReviewPage;
