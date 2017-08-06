import {connect} from 'react-redux'
import {addDeck, reviewDeck, fetchCollectionRequest, fetchCollection} from '../actions/index'
import MainPage from '../MainPage'

const mapStateToProps = (state, ownProps) => {
    return {...state.mainPage, clock: ownProps.clock};
};

const mapDispatchToProps = (dispatch, ownProps) => {

    return {
        fetchCollections: () => {
            dispatch(fetchCollectionRequest());
        },
        back: () => {
            dispatch(fetchCollection());
        },
        reviewDeck: id => {
            dispatch(reviewDeck(id))
        },
        addDeck: name => {
            dispatch(addDeck(name))
        }
    }
};

const MainPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(MainPage);

export default MainPageContainer