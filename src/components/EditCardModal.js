//@flow
import React from 'react'
import '../styles/AddCardModal.css'
import type { FormatType } from '../persist/Dao'
import CardModal from './CardModal'

export type Props = {|
  +cardId: string,
  +deckId: string,
  +question: string,
  +answer: string,
  +format: FormatType,
  +updateCard: (deckId: string, id: string, format: FormatType, question: string, answer: string) => void,
  +restartTimer: () => void
|}

type State = {|
  format: FormatType,
  question: string,
  answer: string
|}

class EditCardModal extends React.Component<Props, State> {
  update = (format: FormatType, question: string, answer: string) => {
    this.setState({format: format, question: question, answer: answer})
  }
  confirmed = () => {
    this.props.updateCard(this.props.deckId, this.props.cardId, this.state.format, this.state.question, this.state.answer)
  }

  constructor (props: Props) {
    super(props)

    this.state = {
      format: this.props.format,
      answer: this.props.answer,
      question: this.props.question
    }
  }

  componentWillReceiveProps (nextProps: Props) {
    this.state = {
      format: nextProps.format,
      answer: nextProps.answer,
      question: nextProps.question
    }
  }

  render () {
    return (
      <CardModal closeOnConfirmation={true} question={this.state.question} answer={this.state.answer}
                 title="Edit Card" format={this.state.format} toggleText="Edit" toggleColor="secondary"
                 update={this.update} confirmed={this.confirmed} closedCallback={this.props.restartTimer}/>
    )
  }
}

export default EditCardModal