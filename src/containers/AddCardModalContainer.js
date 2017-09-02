//@flow
import { connect } from 'react-redux'
import type { CombinedState, Dispatch } from '../actions/actionTypes'
import { addCardRequest, startTimer } from '../actions/creators'
import type { FormatType } from '../persist/Dao'
import AddCardModal from '../components/AddCardModal'

type OwnProps = {||}

export const mapStateToProps = (state: CombinedState, ownProps: OwnProps) => {
  const review = state.review

  return {
    deckId: review.deckId
  }
}

export const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => {
  return {
    addCard: (deckId: string, format: FormatType, question: string, answer: string) => {
      dispatch(addCardRequest(deckId, format, question, answer))
    },
    restartTimer: () => dispatch(startTimer())
  }
}

const AddCardModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCardModal)

export default AddCardModalContainer