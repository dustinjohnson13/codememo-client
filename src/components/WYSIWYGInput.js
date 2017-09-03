//@flow
import React from 'react'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
//$FlowFixMe
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import '../styles/AddCardModal.css'

export type Props = {|
  +content: string,
  +update: (value: string) => void
|}

type State = {|
  editorState: EditorState
|}

class WYSIWYGInput extends React.Component<Props, State> {

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

  onEditorStateChange: Function = (editorState: EditorState) => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    this.setState({
      ...this.state,
      editorState: editorState
    })
    this.props.update(html)
  }

  constructor (props: Props) {
    super(props)

    this.state = {
      editorState: this.defaultHtmlContent(this.props.content)
    }
  }

  componentWillReceiveProps (nextProps: Props) {
    // Don't want to reset active editor states while typing, but we do if
    // it's a new entry
    if (nextProps.content === '') {
      this.setState({
        editorState: this.defaultHtmlContent(nextProps.content)
      })
    }
  }

  render () {

    const {editorState} = this.state

    return (

      <Editor
        editorState={editorState}
        wrapperClassName="wysiwyg-wrapper"
        editorClassName="wysiwyg-editor"
        onEditorStateChange={this.onEditorStateChange}
      />
    )
  }
}

export default WYSIWYGInput