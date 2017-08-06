import {connect} from 'react-redux'
import {addDeck, showCollections, reviewDeck} from '../actions/index'
import MainPage from '../MainPage'

const mapStateToProps = state => {
    return state.mainPage;
};

const mapDispatchToProps = dispatch => {

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