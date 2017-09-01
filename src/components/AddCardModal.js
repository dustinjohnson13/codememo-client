//@flow
import React from 'react'
import { FormGroup, Input, InputGroup, Label } from 'reactstrap'
import '../styles/AddCardModal.css'
import ModalWrapper from './ModalWrapper'
import type { FormatType } from '../persist/Dao'
import { Format } from '../persist/Dao'

type Props = {
  +deckId: string,
  +addCard: (deckId: string, format: FormatType, question: string, answer: string) => void,
  +restartTimer: () => void
}

type State = {
  format: FormatType,
  question: string,
  answer: string
}

class AddCardModal extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {format: Format.PLAIN, answer: '', question: ''};

    (this: any).handleFormatChange = this.handleFormatChange.bind(this);
    (this: any).handleQuestionChange = this.handleQuestionChange.bind(this);
    (this: any).handleAnswerChange = this.handleAnswerChange.bind(this);
    (this: any).addCard = this.addCard.bind(this)
  }

  handleFormatChange (event: SyntheticInputEvent<Input>) {
    // $FlowFixMe
    this.setState({format: event.target.value})
  }

  handleQuestionChange (event: SyntheticInputEvent<Input>) {
    this.setState({question: event.target.value})
  }

  handleAnswerChange (event: SyntheticInputEvent<Input>) {
    this.setState({answer: event.target.value})
  }

  addCard () {
    this.props.addCard(this.props.deckId, this.state.format, this.state.question, this.state.answer)
    this.setState({answer: '', question: ''})
  }

  render () {

    return (
      <span>
                <ModalWrapper title="New Card" toggleText="Add" closeOnConfirmation={false}
                              confirmAction={this.addCard} closedCallback={this.props.restartTimer}>
                    <FormGroup>
                      <Label for="format">Format:</Label>
                        <Input type="select" name="select" id="format" onChange={this.handleFormatChange}>
                            {Object.keys(Format).map(key => <option key={key}>{key}</option>)}
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