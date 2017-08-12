//@flow
import {connect} from 'react-redux'
import {addDeck, fetchCollectionRequest, reviewDeck} from '../actions/creators'
import CollectionPage from '../components/CollectionPage'
import type {Dispatch} from "../actions/actionTypes";
import type {DataService} from "../services/DataService";
import {Deck} from "../services/APIDomain";

type OwnProps = {
    dataService: DataService;
}

export const mapStateToProps = (state: { collection: { decks: Array<Deck> } }, ownProps: OwnProps) => ({
    decks: state.collection.decks
});

export const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => {

    const dataService = ownProps.dataService;

    return {
        fetchCollections: () => {
            dispatch(fetchCollectionRequest());
        },
        reviewDeck: (name: string) => {
            dispatch(reviewDeck(dataService, name))
        },
        addDeck: (name: string) => {
            dispatch(addDeck(dataService, name))
        }
    }
};

const CollectionPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CollectionPage);

export default CollectionPageContainer