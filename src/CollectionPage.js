import React, {Component} from 'react';
import {Button, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row} from 'reactstrap';
import * as domain from './Domain'
import './CollectionPage.css';

class CollectionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };
    }

    static deck(clock, number) {
        const cards = [];
        const dueCount = Math.floor(Math.random() * 30) + 1;
        const newCount = Math.floor(Math.random() * 15) + 1;
        const totalCount = dueCount + newCount + (Math.floor(Math.random() * 15) + 1);
        const currentTime = clock.epochSeconds();

        for (let i = 0; i < totalCount; i++) {
            let dueTime = null;
            if (i > dueCount) {
                dueTime = currentTime + (10000 * i);
            } else if (i > newCount) {
                dueTime = currentTime - (10000 * i);
            }

            const card = new domain.Card(`Question Number ${i}?`, `Answer Number ${i}`, dueTime);
            cards.push(card);
        }

        return new domain.Deck(`Deck${number}`, cards);
    }

    render() {
        return (
            <div>
                <Container>
                    <Collection decks={this.props.collection.decks} reviewDeck={this.props.reviewDeck}
                                clock={this.props.clock}/>
                </Container>

                <ModalExample addNewDeck={this.props.addNewDeckToStore} clock={this.props.clock}/>
            </div>
        );
    }
}

class Collection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const decks = this.props.decks.map((deck) => <Deck deck={deck} key={deck.name}
                                                           reviewDeck={this.props.reviewDeck}
                                                           clock={this.props.clock}/>);

        return (
            <Row>
                <Col sm="12" className="collection">
                    {decks}
                </Col>
            </Row>
        );
    }
}

class Deck extends Component {
    constructor(props) {
        super(props);

        this.review = this.review.bind(this);
    }

    review() {
        this.props.reviewDeck(this.props.deck.name)
    }

    render() {
        const dueCount = this.props.deck.getDue(this.props.clock).length;
        const newCount = this.props.deck.getNew().length;

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

class ModalExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.deckConfirmed = this.deckConfirmed.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    deckConfirmed() {
        const clock = this.props.clock;
        const deck = CollectionPage.deck(clock, clock.epochSeconds());

        this.props.addNewDeck(deck);
        this.toggle();
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        return (
            <div>
                <Button color="primary" onClick={this.toggle}>Create Deck</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                    <ModalBody>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.deckConfirmed}>Do Something</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default CollectionPage;
