//@flow
import React, { Component } from 'react'
import { Col, Row } from 'reactstrap'
import { Deck as APIDeck } from '../services/APIDomain'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

type Props = {
  +reviewDeck: (id: string) => void;
  +deleteDeck: (id: string) => void;
  +deck: APIDeck;
}

class Deck extends Component<Props, void> {

  deleteDeck = () => {
    confirmAlert({
      title: '',
      message: `Are you sure you want to delete "${this.props.deck.name}"?`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      onConfirm: () => this.props.deleteDeck(this.props.deck.id)
    })
  }

  review = () => {
    this.props.reviewDeck(this.props.deck.id)
  }

  render () {
    const dueCount = this.props.deck.dueCount
    const newCount = this.props.deck.newCount

    return (
      <Col sm={{size: 6, offset: 3}}>
        <Row className="deck">
          <Col sm="6">
            <div className="deck-info">
              <div className="deck-name">{this.props.deck.name}</div>
              <div><span className="due-count">{dueCount}</span> Due, <span
                className="new-count">{newCount}</span> New
              </div>
            </div>
          </Col>
          <Col sm="6">
            <div className="deck-actions">
              <div><a className="review-deck" onClick={this.review}>Review</a></div>
              <div><a className="delete-deck" onClick={this.deleteDeck}>Delete</a></div>
            </div>
          </Col>
        </Row>
      </Col>
    )
  }
}

export default Deck