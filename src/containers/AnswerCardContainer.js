//@flow
import {connect} from 'react-redux'
import AnswerCard from '../components/AnswerCard'
import type {CombinedState, Dispatch} from "../actions/actionTypes"
import {answerCardRequest, hideAnswer} from "../actions/creators"
import type {AnswerType, Clock} from "../services/APIDomain"
import {SystemClock} from "../services/API"

type OwnProps = {
    +id: string,
    +deckId: string,
    +answerCard: (answer: AnswerType) => void,
    +startTime: number,
    +clock: Clock
}

export const mapStateToProps = (state: CombinedState, ownProps: OwnProps) => {
    const props = state.review

    return {
        failInterval: props.failInterval,
        hardInterval: props.hardInterval,
        goodInterval: props.goodInterval,
        easyInterval: props.easyInterval,
        startTime: ownProps.startTime,
        clock: ownProps.clock
    }
}

export const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => {
    return {
        answerCard: (startTime: number, endTime: number, answer: AnswerType) => {
            dispatch(hideAnswer())
            dispatch(answerCardRequest(ownProps.id, ownProps.deckId, startTime, endTime, answer))
        }
    }
}

const AnswerCardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AnswerCard)

export default AnswerCardContainer