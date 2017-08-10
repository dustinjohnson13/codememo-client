import {connect} from 'react-redux'
import {answerCard, collectionPage} from '../actions/creators'
import ReviewPage from '../components/ReviewPage'

export const mapStateToProps = (state, ownProps) => {
    const props = state.review;

    return {
        deckName: props.deckName,
        newCount: props.newCount,
        dueCount: props.dueCount,
        totalCount: props.totalCount,
        question: props.question,
        answer: props.answer,
        id: props.toReview.length > 0 ? props.toReview[0].id : undefined
    };
};

export const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        back: () => {
            dispatch(collectionPage());
        },
        answerCard: (id, answer) => {
            dispatch(answerCard(ownProps.dataService, id, answer))
        }
    }
};

const ReviewPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReviewPage);

export default ReviewPageContainer