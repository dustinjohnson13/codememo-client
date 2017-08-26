//@flow
import React, {Component} from 'react'
import Deck from './Deck'
import {Col, Row} from 'reactstrap'
import * as api from "../services/APIDomain"

type Props = {
    +decks: Array<api.Deck>,
    +reviewDeck: (id: string) => void
}

class Collection extends Component<Props, void> {

    render() {
        const decks = this.props.decks.map(deck =>
            <Deck deck={deck} key={deck.name} reviewDeck={this.props.reviewDeck}/>)

        return (
            <Row>
                <Col sm="12" className="collection">
                    {decks}
                </Col>
            </Row>
        )
    }
}

export default Collection