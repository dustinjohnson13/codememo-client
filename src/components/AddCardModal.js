//@flow
import React from 'react'
import {Input, InputGroup} from 'reactstrap'
import '../styles/AddCardModal.css'
import ModalWrapper from "./ModalWrapper"

type Props = {
    +deckId: string,
    +addCard: (deckId: string, question: string, answer: string) => void
}

type State = {
    question: string,
    answer: string
}

class AddCardModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {answer: '', question: ''};

        (this: any).handleQuestionChange = this.handleQuestionChange.bind(this);
        (this: any).handleAnswerChange = this.handleAnswerChange.bind(this);
        (this: any).addCard = this.addCard.bind(this);
    }

    handleQuestionChange(event: SyntheticInputEvent<Input>) {
        this.setState({question: event.target.value})
    }

    handleAnswerChange(event: SyntheticInputEvent<Input>) {
        this.setState({answer: event.target.value})
    }

    addCard() {
        this.props.addCard(this.props.deckId, this.state.question, this.state.answer)
        this.setState({answer: '', question: ''})
    }

    render() {
        return (
            <span>
                <ModalWrapper title="New Card" toggleText="Add" closeOnConfirmation={false}
                              confirmAction={this.addCard}>
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