//@flow
import {connect} from 'react-redux'
import {addCardRequest, collectionPage} from '../actions/creators'
import ReviewPage from '../components/ReviewPage'
import type {CombinedState, Dispatch} from "../actions/actionTypes";

type OwnProps = {}

export const mapStateToProps = (state: CombinedState, ownProps: OwnProps) => {
    const props = state.review;

    return {
        deckName: props.deckName,
        newCount: props.newCount,
        dueCount: props.dueCount,
        totalCount: props.totalCount
    };
};

export const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => {
    return {
        back: () => {
            dispatch(collectionPage());
        },
        addCard: (deckId: string, question: string, answer: string) => {
            dispatch(addCardRequest(deckId, question, answer));
        }
    }
};

const ReviewPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReviewPage);

export default ReviewPageContainer