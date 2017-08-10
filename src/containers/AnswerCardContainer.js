import {connect} from 'react-redux'
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
            ownProps.answerCard(ownProps.id, answer);
        }
    }
};

const AnswerCardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AnswerCard);

export default AnswerCardContainer