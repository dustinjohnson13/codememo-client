//@flow
import React from 'react'
import { Button, Col, Form, FormGroup, Input, InputGroup, Label } from 'reactstrap'
import ModalWrapper from './ModalWrapper'
import type { FormatType } from '../persist/Dao'
import { Format } from '../persist/Dao'
import '../styles/AddCardModal.css'
import WYSIWYGInput from './WYSIWYGInput'

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
  modalOpen: boolean
|}

class CardModal extends React.Component<Props, State> {

  handleFormatChange = (event: SyntheticInputEvent<Input>) => {
    //$FlowFixMe
    this.props.update(event.target.value, this.props.question, this.props.answer)
  }
  handleQuestionChange = (event: SyntheticInputEvent<Input>) => {
    this.props.update(this.props.format, event.target.value, this.props.answer)
  }
  onHTMLQuestionChange = (content: string) => {
    this.props.update(this.props.format, content, this.props.answer)
  }
  handleAnswerChange = (event: SyntheticInputEvent<Input>) => {
    this.props.update(this.props.format, this.props.question, event.target.value)
  }
  onHTMLAnswerChange = (content: string) => {
    this.props.update(this.props.format, this.props.question, content)
  }

  toggleModal = () => {
    const open = !this.state.modalOpen

    this.setState({
      modalOpen: open
    })

    if (!open) {
      this.props.closedCallback()
    }
  }

  confirm = () => {
    this.props.confirmed()
  }

  constructor (props: Props) {
    super(props)

    this.state = {
      modalOpen: false
    }
  }

  render () {

    const inputGroupClass = this.props.format === Format.PLAIN ? 'question-group' : 'html-question-group'
    const questionEditor = this.props.format === Format.PLAIN ?
      <Input type="textarea" placeholder="question" value={this.props.question}
             onChange={this.handleQuestionChange}/> :
      <WYSIWYGInput content={this.props.question} update={this.onHTMLQuestionChange}/>

    const answerInputGroupClass = this.props.format === Format.PLAIN ? 'answer-group' : 'html-answer-group'
    const answerEditor = this.props.format === Format.PLAIN ?
      <Input type="textarea" placeholder="answer" value={this.props.answer}
             onChange={this.handleAnswerChange}/> :
      <WYSIWYGInput content={this.props.answer} update={this.onHTMLAnswerChange}/>

    return (
      <span>
        <Button color={this.props.toggleColor} onClick={this.toggleModal}>{this.props.toggleText}</Button>
        <ModalWrapper open={this.state.modalOpen} title={this.props.title}
                      closeOnConfirmation={this.props.closeOnConfirmation}
                      confirmText={'Save'} confirmAction={this.confirm}
                      closedCallback={this.toggleModal} className="modal-lg">
          <Form>
            <FormGroup row>
              <Label sm={2} for="format">Format:</Label>
              <Col sm={10}>
              <Input type="select" name="select" id="format" value={this.props.format}
                     onChange={this.handleFormatChange}>
                    {Object.keys(Format).map(key =>
                      <option key={key}>{key}</option>)}
                </Input>
              </Col>
            </FormGroup>
            <InputGroup className={inputGroupClass}>
              {questionEditor}
            </InputGroup>
            <InputGroup className={answerInputGroupClass}>
              {answerEditor}
            </InputGroup>
          </Form>
        </ModalWrapper>
       </span>
    )
  }
}

export default CardModal