//@flow
import { connect } from 'react-redux'
import { collectionPage, deleteCardRequest } from '../actions/creators'
import ReviewPage from '../components/ReviewPage'
import type { CombinedState, Dispatch } from '../actions/actionTypes'

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
    deleteCard: (id: string) => {
      dispatch(deleteCardRequest(id))
    }
  }
}

const ReviewPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewPage)

export default ReviewPageContainer