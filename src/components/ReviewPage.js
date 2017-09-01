//@flow
import React, { Component } from 'react'
import { Button } from 'reactstrap'
import '../styles/ReviewPage.css'
import ReviewCardContainer from '../containers/ReviewCardContainer'
import AddCardModal from './AddCardModal'
import type { FormatType } from '../persist/Dao'

type Props = {
  +id: string,
  +deckName: string,
  +totalCount: number,
  +dueCount: number,
  +newCount: number,
  +back: () => void,
  +addCard: (deckId: string, format: FormatType, question: string, answer: string) => void,
  +showAnswer: () => void,
  +restartTimer: () => void
}

class ReviewPage extends Component<Props, void> {
  render () {
    const reviewSection = (this.props.dueCount === 0 && this.props.newCount === 0) ?
      <div>Congratulations, you're caught up!</div> : <ReviewCardContainer/>
    return (
      <div>
        <div className="menu">
          <a className="back" onClick={this.props.back}>&lt;&nbsp;Back</a>
          <AddCardModal deckId={this.props.id} addCard={this.props.addCard}
                        restartTimer={this.props.restartTimer}/>
          <Button>Edit</Button><Button>Find</Button>
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
