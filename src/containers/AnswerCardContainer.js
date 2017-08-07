import {connect} from 'react-redux'
import {answerCard} from '../actions/index'
import AnswerCard from '../AnswerCard'

const mapStateToProps = (state, ownProps) => {
    const props = state.review;

    return {
        failInterval: props.failInterval,
        hardInterval: props.hardInterval,
        goodInterval: props.goodInterval,
        easyInterval: props.easyInterval
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {

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