//@flow
import {connect} from 'react-redux'
import AnswerCard from '../components/AnswerCard'
import type {CombinedState, Dispatch} from "../actions/actionTypes";

type OwnProps = {
    id: string;
    answerCard: any;
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
        answerCard: (answer: any) => {
            ownProps.answerCard(ownProps.id, answer);
        }
    }
};

const AnswerCardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AnswerCard);

export default AnswerCardContainer