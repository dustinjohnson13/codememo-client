//@flow
import {connect} from 'react-redux'
import {answerCard} from '../actions/creators.js'
import {loadCollectionPage} from '../actions/creators'
import ReviewPage from '../components/ReviewPage'
import type {CombinedState, Dispatch} from "../actions/actionTypes";
import type {DataService} from "../services/DataService";

type OwnProps = {
    dataService: DataService;
}

export const mapStateToProps = (state: CombinedState, ownProps: OwnProps) => {
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

export const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => {
    return {
        back: () => {
            dispatch(loadCollectionPage());
        },
        answerCard: (id: string, answer: string) => {
            dispatch(answerCard(id, answer))
        }
    }
};

const ReviewPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReviewPage);

export default ReviewPageContainer