import React, {Component} from 'react';
import {Button} from 'reactstrap';
import '../styles/ReviewPage.css';
import ReviewCard from "./ReviewCard";

class ReviewPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="menu">
                    <a href="JavaScript:void(0)" className="back" onClick={this.props.back}>&lt;&nbsp;Back</a>
                    <Button>Add</Button><Button>Edit</Button><Button>Find</Button>
                    <a href="JavaScript:void(0)" className="tools">Tools</a>
                </div>
                <h3>{this.props.deckName}</h3>
                <h5>{this.props.totalCount} cards (<span
                    className="due-count">{this.props.dueCount}</span> due,
                    <span className="new-count"> {this.props.newCount}</span> new)</h5>

                <ReviewCard/>
            </div>
        );
    }
}

export default ReviewPage;
