//@flow
import { connect } from 'react-redux'
import { addCardRequest, collectionPage, deleteCardRequest, startTimer } from '../actions/creators'
import ReviewPage from '../components/ReviewPage'
import type { CombinedState, Dispatch } from '../actions/actionTypes'
import type { FormatType } from '../persist/Dao'

type OwnProps = {}

export const mapStateToProps = (state: CombinedState, ownProps: OwnProps) => {
  const props = state.review

  return {
    id: props.deckId,
    deckName: props.deckName,
    newCount: props.newCards.length,
    dueCount: props.dueCards.length,
    totalCount: props.totalCount,
    cardId: props.cardId
  }
}

export const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => {
  return {
    back: () => {
      dispatch(collectionPage())
    },
    addCard: (deckId: string, format: FormatType, question: string, answer: string) => {
      dispatch(addCardRequest(deckId, format, question, answer))
    },
    deleteCard: (id: string) => {
      dispatch(deleteCardRequest(id))
    },
    restartTimer: () => dispatch(startTimer())
  }
}

const ReviewPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewPage)

export default ReviewPageContainer