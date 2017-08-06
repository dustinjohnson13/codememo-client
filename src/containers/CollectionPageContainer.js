import {connect} from 'react-redux'
import {addDeck, fetchCollectionRequest, fetchDeck} from '../actions/index'
import CollectionPage from '../CollectionPage'

const mapStateToProps = (state, ownProps) => {
    return {
        ...state.collectionPage,
        clock: ownProps.clock,
        collection: state.collectionPage.collection
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {

    return {
        fetchCollections: () => {
            dispatch(fetchCollectionRequest());
        },
        fetchDeck: name => {
            dispatch(fetchDeck(name))
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