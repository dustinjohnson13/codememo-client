//@flow
import {connect} from 'react-redux'
import {showAnswer} from '../actions/creators'
import type {CombinedState, Dispatch} from "../actions/actionTypes";
import ReviewCard from "../components/ReviewCard";

type OwnProps = {}

export const mapStateToProps = (state: CombinedState, ownProps: OwnProps) => {
    const props = state.review;

    return {
        question: props.question,
        answer: props.answer,
        cardId: props.toReview.length > 0 ? props.toReview[0].id : undefined,
        deckId: props.deckId,
        showingAnswer: props.showingAnswer
    };
};

export const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => {
    return {
        showAnswer: () => {
            dispatch(showAnswer())
        }
    }
};

const ReviewCardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReviewCard);

export default ReviewCardContainer