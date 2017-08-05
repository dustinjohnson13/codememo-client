import React, {Component} from 'react';
import {Button} from 'reactstrap';
import './ReviewPage.css';

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
                <h3>{this.props.deck.name}</h3>
                <h5>{this.props.deck.cards.length} cards (<span className="due-count">{this.props.deck.getDue().length}</span> due,
                    <span className="new-count"> {this.props.deck.getNew().length}</span> new)</h5>
            </div>
        );
    }
}

export default ReviewPage;
