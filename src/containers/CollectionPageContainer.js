//@flow
import {connect} from 'react-redux'
import {addDeckRequest, fetchCollectionRequest, reviewDeckRequest} from '../actions/creators'
import CollectionPage from '../components/CollectionPage'
import type {Dispatch} from "../actions/actionTypes";
import {Deck} from "../services/APIDomain";

type OwnProps = {}

export const mapStateToProps = (state: { collection: { decks: Array<Deck> } }, ownProps: OwnProps) => ({
    decks: state.collection.decks
});

export const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => {

    return {
        fetchCollections: () => {
            dispatch(fetchCollectionRequest());
        },
        reviewDeck: (name: string) => {
            dispatch(reviewDeckRequest(name))
        },
        addDeck: (name: string) => {
            dispatch(addDeckRequest(name))
        }
    }
};

const CollectionPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CollectionPage);

export default CollectionPageContainer