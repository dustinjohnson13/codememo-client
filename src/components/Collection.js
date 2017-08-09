import React, {Component} from 'react';
import Deck from './Deck'
import {Col, Row} from 'reactstrap';

class Collection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const decks = this.props.decks.map(deck =>
            <Deck deck={deck} key={deck.name} reviewDeck={this.props.fetchDeck}/>);

        return (
            <Row>
                <Col sm="12" className="collection">
                    {decks}
                </Col>
            </Row>
        );
    }
}

export default Collection;