import {connect} from 'react-redux'
import {addDeck, fetchCollectionRequest, fetchDeck} from '../actions/index'
import CollectionPage from '../components/CollectionPage'

export const mapStateToProps = (state, ownProps) => ({
   decks: state.collection.decks
});

export const mapDispatchToProps = (dispatch, ownProps) => {

    const dataService = ownProps.dataService;

    return {
        fetchCollections: () => {
            dispatch(fetchCollectionRequest());
        },
        fetchDeck: name => {
            dispatch(fetchDeck(dataService, name))
        },
        addDeck: name => {
            dispatch(addDeck(dataService, name))
        }
    }
};

const CollectionPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CollectionPage);

export default CollectionPageContainer