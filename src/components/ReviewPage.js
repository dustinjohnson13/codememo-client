//@flow
import React, { Component } from 'react'
import { Button } from 'reactstrap'
import '../styles/ReviewPage.css'
import ReviewCardContainer from '../containers/ReviewCardContainer'
import AddCardModalContainer from '../containers/AddCardModalContainer'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

type Props = {|
  +id: string,
  +deckName: string,
  +cardId: string,
  +totalCount: number,
  +dueCount: number,
  +newCount: number,
  +back: () => void,
  +showAnswer: () => void,
  +deleteCard: (id: string) => void
|}

class ReviewPage extends Component<Props, void> {
  deleteCard = () => {
    confirmAlert({
      title: '',
      message: `Are you sure you want to delete this card?`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      onConfirm: () => this.props.deleteCard(this.props.cardId)
    })
  }

  render () {
    const doneReviewing = (this.props.dueCount === 0 && this.props.newCount === 0)

    const reviewSection = doneReviewing ? <div>Congratulations, you're caught up!</div> : <ReviewCardContainer/>

    const editButton = doneReviewing ? '' : <AddCardModalContainer editMode={true}/>

    return (
      <div>
        <div className="menu">
          <a className="back" onClick={this.props.back}>&lt;&nbsp;Back</a>
          <AddCardModalContainer editMode={false}/>
          {editButton}
          <Button>Find</Button>
          <Button color="danger" onClick={this.deleteCard}>Delete</Button>
          <a className="tools">Tools</a>
        </div>
        <h3>{this.props.deckName}</h3>
        <h5>{this.props.totalCount} cards (
          <span className="due-count">{this.props.dueCount}</span> due,&nbsp;
          <span className="new-count">{this.props.newCount}</span> new)</h5>

        {reviewSection}
      </div>
    )
  }
}

export default ReviewPage
