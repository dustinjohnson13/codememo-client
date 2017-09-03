//@flow
import React from 'react'
import { Button, Col, Form, FormGroup, Input, InputGroup, Label } from 'reactstrap'
import ModalWrapper from './ModalWrapper'
import type { FormatType } from '../persist/Dao'
import { Format } from '../persist/Dao'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
//$FlowFixMe
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import '../styles/AddCardModal.css'

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
  modalOpen: boolean,
  questionState: EditorState,
  answerState: EditorState
|}

class CardModal extends React.Component<Props, State> {

  defaultHtmlContent = (input: string): EditorState => {
    if (input !== '') {
      const contentBlock = htmlToDraft(input)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        return EditorState.createWithContent(contentState)
      }
    }
    return EditorState.createEmpty()
  }
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

  onQuestionEditorStateChange: Function = (editorState: EditorState) => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    this.setState({
      ...this.state,
      questionState: editorState
    })
    this.props.update(this.props.format, html, this.props.answer)
  }

  onAnswerEditorStateChange: Function = (editorState: EditorState) => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    this.setState({
      ...this.state,
      answerState: editorState
    })
    this.props.update(this.props.format, this.props.question, html)
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
      modalOpen: false,
      answerState: this.defaultHtmlContent(this.props.answer),
      questionState: this.defaultHtmlContent(this.props.question)
    }
  }

  componentWillReceiveProps (nextProps: Props) {
    // Don't want to reset active editor states while typing, but we do if
    // the editor isn't open, or the format changes, or it's a new question
    if (!this.state.modalOpen || (this.props.format !== nextProps.format) || (nextProps.question === '')) {
      this.setState({
        answerState: this.defaultHtmlContent(nextProps.answer),
        questionState: this.defaultHtmlContent(nextProps.question)
      })
    }
  }

  render () {

    const {questionState, answerState} = this.state

    const inputGroupClass = this.props.format === Format.PLAIN ? 'question-group' : 'html-question-group'
    const questionEditor = this.props.format === Format.PLAIN ?
      <Input type="textarea" placeholder="question" value={this.props.question}
             onChange={this.handleQuestionChange}/> : <Editor
        editorState={questionState}
        wrapperClassName="question-wrapper"
        editorClassName="question-editor"
        onEditorStateChange={this.onQuestionEditorStateChange}
      />

    const answerInputGroupClass = this.props.format === Format.PLAIN ? 'answer-group' : 'html-answer-group'
    const answerEditor = this.props.format === Format.PLAIN ?
      <Input type="textarea" placeholder="answer" value={this.props.answer}
             onChange={this.handleAnswerChange}/> : <Editor
        editorState={answerState}
        wrapperClassName="answer-wrapper"
        editorClassName="answer-editor"
        onEditorStateChange={this.onAnswerEditorStateChange}
      />

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