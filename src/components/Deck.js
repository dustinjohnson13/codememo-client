import React, {Component} from 'react';
import {Col, Row} from 'reactstrap';

class Deck extends Component {
    constructor(props) {
        super(props);

        this.review = this.review.bind(this);
    }

    review() {
        this.props.reviewDeck(this.props.deck.name)
    }

    render() {
        const dueCount = this.props.deck.due;
        const newCount = this.props.deck.new;

        return (
            <Col sm={{size: 6, offset: 3}}>
                <Row className="deck" onClick={this.review}>
                    <Col sm="8">
                        <div className="deck-name">
                            <span>{this.props.deck.name}</span>
                        </div>
                    </Col>
                    <Col sm="4">
                            <span className="card-counts">
                                 <span className="due-count">{dueCount}</span> / <span
                                className="new-count">{newCount}</span> >
                            </span>
                    </Col>
                </Row>
            </Col>
        );
    }
}

export default Deck;