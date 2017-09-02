//@flow
import { connect } from 'react-redux'
import type { CombinedState, Dispatch } from '../actions/actionTypes'
import { addCardRequest, startTimer, updateCardRequest } from '../actions/creators'
import type { FormatType } from '../persist/Dao'
import AddCardModal from '../components/AddCardModal'

type OwnProps = {|
  +editMode: boolean
|}

export const mapStateToProps = (state: CombinedState, ownProps: OwnProps) => {
  const review = state.review

  return {
    editMode: ownProps.editMode,
    cardId: review.cardId,
    deckId: review.deckId,
    question: review.question,
    answer: review.answer,
    format: review.format
  }
}

export const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => {
  return {
    addCard: (deckId: string, format: FormatType, question: string, answer: string) => {
      dispatch(addCardRequest(deckId, format, question, answer))
    },
    updateCard: (deckId: string, cardId: string, format: FormatType, question: string, answer: string) => {
      dispatch(updateCardRequest(deckId, cardId, format, question, answer))
    },
    restartTimer: () => dispatch(startTimer())
  }
}

const AddCardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCardModal)

export default AddCardContainer