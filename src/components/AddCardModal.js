//@flow
import React from 'react'
import '../styles/AddCardModal.css'
import type { FormatType } from '../persist/Dao'
import { Format } from '../persist/Dao'
import CardModal from './CardModal'

export type Props = {|
  +deckId: string,
  +addCard: (deckId: string, format: FormatType, question: string, answer: string) => void,
  +restartTimer: () => void
|}

type State = {|
  format: FormatType,
  question: string,
  answer: string
|}

class AddCardModal extends React.Component<Props, State> {
  update = (format: FormatType, question: string, answer: string) => {
    this.setState({
        format: format, question: question, answer: answer
      }
    )
  }

  confirmed = () => {
    this.props.addCard(this.props.deckId, this.state.format, this.state.question, this.state.answer)
    this.setState({
      answer: '',
      question: ''
    })
  }

  constructor (props: Props) {
    super(props)

    this.state = {
      format: Format.PLAIN, answer: '', question: ''
    }
  }

  render () {

    return (
      <CardModal closeOnConfirmation={false} question={this.state.question} answer={this.state.answer}
                 title="Add Card" format={this.state.format} toggleText="Add" toggleColor="primary"
                 update={this.update} confirmed={this.confirmed} closedCallback={this.props.restartTimer}/>
    )
  }
}

export default AddCardModal