//@flow
import React from 'react'
import { FormGroup, Input, InputGroup, Label } from 'reactstrap'
import '../styles/AddCardModal.css'
import ModalWrapper from './ModalWrapper'
import type { FormatType } from '../persist/Dao'
import { Format } from '../persist/Dao'

export type Props = {|
  +title: string,
  +closeOnConfirmation: boolean,
  +question: string,
  +answer: string,
  +format: FormatType,
  +toggleText: string,
  +toggleColor: string,
  +update: (format: FormatType, question: string, answer: string) => void,
  +confirmed: () => void,
  +closedCallback: () => void
|}

type State = {|
  format: FormatType,
  question: string,
  answer: string
|}

class CardModal extends React.Component<Props, State> {
  handleFormatChange = (event: SyntheticInputEvent<Input>) => {
    //$FlowFixMe
    this.props.update(event.target.value, this.props.question, this.props.answer)
  }
  handleQuestionChange = (event: SyntheticInputEvent<Input>) => {
    this.props.update(this.props.format, event.target.value, this.props.answer)
  }
  handleAnswerChange = (event: SyntheticInputEvent<Input>) => {
    this.props.update(this.props.format, this.props.question, event.target.value)
  }

  render () {
    return (
      <span>
        <ModalWrapper title={this.props.title} toggleText={this.props.toggleText}
                      closeOnConfirmation={this.props.closeOnConfirmation}
                      confirmText={'Save'} confirmAction={this.props.confirmed}
                      toggleColor={this.props.toggleColor} closedCallback={this.props.closedCallback}>
            <FormGroup>
              <Label for="format">Format:</Label>
                <Input type="select" name="select" id="format" value={this.props.format}
                       onChange={this.handleFormatChange}>
                    {Object.keys(Format).map(key =>
                      <option key={key}>{key}</option>)}
                </Input>
            </FormGroup>
            <InputGroup className="question-group">
                <Input type="textarea" placeholder="question" value={this.props.question}
                       onChange={this.handleQuestionChange}/>
            </InputGroup>
            <InputGroup className="answer-group">
                <Input type="textarea" placeholder="answer" value={this.props.answer}
                       onChange={this.handleAnswerChange}/>
            </InputGroup>
        </ModalWrapper>
      </span>
    )
  }
}

export default CardModal