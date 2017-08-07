import {connect} from 'react-redux'
import {collectionPage} from '../actions/index'
import ReviewPage from '../ReviewPage'

const mapStateToProps = (state, ownProps) => {
    const props = state.reviewPage;

    return {
        deckName: props.deckName,
        newCount: props.newCount,
        dueCount: props.dueCount,
        totalCount: props.totalCount
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {

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