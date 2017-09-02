//@flow
import { connect } from 'react-redux'
import type { CombinedState, Dispatch } from '../actions/actionTypes'
import { startTimer, updateCardRequest } from '../actions/creators'
import type { FormatType } from '../persist/Dao'
import EditCardModal from '../components/EditCardModal'

type OwnProps = {|
  +editMode: boolean
|}

export const mapStateToProps = (state: CombinedState, ownProps: OwnProps) => {
  const review = state.review

  return {
    cardId: review.cardId,
    deckId: review.deckId,
    question: review.question,
    answer: review.answer,
    format: review.format
  }
}

export const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => {
  return {
    updateCard: (deckId: string, cardId: string, format: FormatType, question: string, answer: string) => {
      dispatch(updateCardRequest(deckId, cardId, format, question, answer))
    },
    restartTimer: () => dispatch(startTimer())
  }
}

const EditCardModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditCardModal)

export default EditCardModalContainer