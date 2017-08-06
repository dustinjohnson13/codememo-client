import {connect} from 'react-redux'
import {addDeck, fetchCollectionRequest, reviewDeck} from '../actions/index'
import CollectionPage from '../CollectionPage'

const mapStateToProps = (state, ownProps) => {
    return {...state.mainPage,
        clock: ownProps.clock,
        collection: state.mainPage.collection
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {

    return {
        fetchCollections: () => {
            dispatch(fetchCollectionRequest());
        },
        reviewDeck: id => {
            dispatch(reviewDeck(id))
        },
        addDeck: name => {
            dispatch(addDeck(name))
        }
    }
};

const CollectionPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CollectionPage);

export default CollectionPageContainer