import React from 'react';
import {Input, InputGroup} from 'reactstrap';
import '../styles/AddCardModal.css';
import ModalWrapper from "./ModalWrapper";

class AddCardModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {answer: '', question: ''};

        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleAnswerChange = this.handleAnswerChange.bind(this);
        this.addCard = this.addCard.bind(this);
    }

    handleQuestionChange(event) {
        this.setState({question: event.target.value});
    }

    handleAnswerChange(event) {
        this.setState({answer: event.target.value});
    }

    addCard() {
        this.props.addCard(this.props.deckId, this.state.question, this.state.answer);
    }

    render() {
        return (
            <span>
                <ModalWrapper title="New Card" toggleText="Add" confirmAction={this.addCard}>
                    <InputGroup className="question-group">
                        <Input type="textarea" placeholder="question" value={this.state.question} onChange={this.handleQuestionChange}/>
                    </InputGroup>
                    <InputGroup className="answer-group">
                        <Input type="textarea" placeholder="answer" value={this.state.answer} onChange={this.handleAnswerChange}/>
                    </InputGroup>
                </ModalWrapper>
            </span>
        );
    }
}

export default AddCardModal;