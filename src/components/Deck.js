//@flow
import React, {Component} from 'react';
import {Col, Row} from 'reactstrap';
import {Deck as APIDeck} from "../services/APIDomain";

type Props = {
    reviewDeck: any;
    deck: APIDeck;
}

class Deck extends Component {
    constructor(props: Props) {
        super(props);

        (this: any).review = this.review.bind(this);
    }

    review() {
        this.props.reviewDeck(this.props.deck.id)
    }

    render() {
        const dueCount = this.props.deck.dueCount;
        const newCount = this.props.deck.newCount;

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