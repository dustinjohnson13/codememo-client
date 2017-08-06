import {connect} from 'react-redux'
import {fetchCollection} from '../actions/index'
import ReviewPage from '../ReviewPage'

const mapStateToProps = (state, ownProps) => {
    return {
        ...state.mainPage,
        clock: ownProps.clock
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {

    return {
        back: () => {
            dispatch(fetchCollection());
        }
    }
};

const ReviewPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReviewPage);

export default ReviewPageContainer