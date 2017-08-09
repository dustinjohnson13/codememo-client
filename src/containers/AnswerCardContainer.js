import {connect} from 'react-redux'
import {answerCard} from '../actions/creators'
import AnswerCard from '../components/AnswerCard'

export const mapStateToProps = (state, ownProps) => {
    const props = state.review;

    return {
        failInterval: props.failInterval,
        hardInterval: props.hardInterval,
        goodInterval: props.goodInterval,
        easyInterval: props.easyInterval
    };
};

export const mapDispatchToProps = (dispatch, ownProps) => {

    return {
        answerCard: (answer) => {
            dispatch(answerCard(answer));
        }
    }
};

const AnswerCardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AnswerCard);

export default AnswerCardContainer