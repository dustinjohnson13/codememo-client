//@flow
import React from 'react'
import { FormGroup, Input, InputGroup, Label } from 'reactstrap'
import '../styles/AddCardModal.css'
import ModalWrapper from './ModalWrapper'
import type { FormatType } from '../persist/Dao'
import { Format } from '../persist/Dao'

type Props = {
  +editMode: boolean,
  +cardId: string,
  +deckId: string,
  +question: string,
  +answer: string,
  +format: FormatType,
  +addCard: (deckId: string, format: FormatType, question: string, answer: string) => void,
  +updateCard: (deckId: string, id: string, format: FormatType, question: string, answer: string) => void,
  +restartTimer: () => void
}

type State = {
  format: FormatType,
  question: string,
  answer: string
}

class AddCardModal extends React.Component<Props, State> {
  handleFormatChange = (event: SyntheticInputEvent<Input>) => {
    // $FlowFixMe
    this.setState({format: event.target.value})
  }
  handleQuestionChange = (event: SyntheticInputEvent<Input>) => {
    this.setState({question: event.target.value})
  }
  handleAnswerChange = (event: SyntheticInputEvent<Input>) => {
    this.setState({answer: event.target.value})
  }
  confirmed = () => {
    if (this.props.editMode) {
      this.props.updateCard(this.props.deckId, this.props.cardId, this.state.format, this.state.question, this.state.answer)
    } else {
      this.props.addCard(this.props.deckId, this.state.format, this.state.question, this.state.answer)
      this.setState({answer: '', question: ''})
    }
  }

  constructor (props: Props) {
    super(props)

    this.state = {
      format: this.props.editMode ? this.props.format : Format.PLAIN,
      answer: this.props.editMode ? this.props.answer : '',
      question: this.props.editMode ? this.props.question : ''
    }
  }

  componentWillReceiveProps (nextProps: Props) {
    this.state = {
      format: this.props.editMode ? nextProps.format : Format.PLAIN,
      answer: this.props.editMode ? nextProps.answer : '',
      question: this.props.editMode ? nextProps.question : ''
    }
  }

  render () {

    const toggleText = this.props.editMode ? 'Edit' : 'Add'
    const toggleColor = this.props.editMode ? 'secondary' : 'primary'

    return (
      <span>
        <ModalWrapper title="New Card" toggleText={toggleText} closeOnConfirmation={this.props.editMode}
                      confirmText={this.props.editMode ? 'Save' : 'Create'} confirmAction={this.confirmed}
                      toggleColor={toggleColor} closedCallback={this.props.restartTimer}>
            <FormGroup>
              <Label for="format">Format:</Label>
                <Input type="select" name="select" id="format" value={this.state.format}
                       onChange={this.handleFormatChange}>
                    {Object.keys(Format).map(key =>
                      <option key={key}>{key}</option>)}
                </Input>
            </FormGroup>
            <InputGroup className="question-group">
                <Input type="textarea" placeholder="question" value={this.state.question}
                       onChange={this.handleQuestionChange}/>
            </InputGroup>
            <InputGroup className="answer-group">
                <Input type="textarea" placeholder="answer" value={this.state.answer}
                       onChange={this.handleAnswerChange}/>
            </InputGroup>
        </ModalWrapper>
      </span>
    )
  }
}

export default AddCardModal