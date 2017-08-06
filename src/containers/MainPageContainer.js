import {connect} from 'react-redux'
import {addDeck, reviewDeck, showCollections} from '../actions/index'
import MainPage from '../MainPage'

const mapStateToProps = (state, ownProps) => {
    return {...state.mainPage, clock: ownProps.clock};
};

const mapDispatchToProps = (dispatch, ownProps) => {

    return {
        showCollections: () => {
            dispatch(showCollections());
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