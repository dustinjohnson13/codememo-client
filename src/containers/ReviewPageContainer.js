import {connect} from 'react-redux'
import {collectionPage} from '../actions/creators'
import ReviewPage from '../components/ReviewPage'

export const mapStateToProps = (state, ownProps) => {
    const props = state.review;

    return {
        deckName: props.deckName,
        newCount: props.newCount,
        dueCount: props.dueCount,
        totalCount: props.totalCount,
        question: props.question,
        answer: props.answer
    };
};

export const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        back: () => {
            dispatch(collectionPage());
        }
    }
};

const ReviewPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReviewPage);

export default ReviewPageContainer