//@flow
import {connect} from 'react-redux'
import AnswerCard from '../components/AnswerCard'
import type {CombinedState, Dispatch} from "../actions/actionTypes";
import {answerCardRequest, hideAnswer} from "../actions/creators";

type OwnProps = {
    id: string;
    deckId: string;
    answerCard: any
}

export const mapStateToProps = (state: CombinedState, ownProps: OwnProps) => {
    const props = state.review;

    return {
        failInterval: props.failInterval,
        hardInterval: props.hardInterval,
        goodInterval: props.goodInterval,
        easyInterval: props.easyInterval
    };
};

export const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => {
    return {
        answerCard: (answer: string) => {
            dispatch(hideAnswer());
            dispatch(answerCardRequest(ownProps.id, ownProps.deckId, answer));
        }
    }
};

const AnswerCardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AnswerCard);

export default AnswerCardContainer