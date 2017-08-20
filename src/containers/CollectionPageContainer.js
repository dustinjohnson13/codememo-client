//@flow
import {connect} from 'react-redux'
import {addDeckRequest, reviewDeckRequest} from '../actions/creators'
import CollectionPage from '../components/CollectionPage'
import type {CombinedState, Dispatch} from "../actions/actionTypes"

type OwnProps = {}

export const mapStateToProps = (state: CombinedState, ownProps: OwnProps) => {
    const decks = state.collection.decks.map(id => state.collection.decksById[id])
    return {
        decks: decks
    }
}

export const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => {

    return {
        reviewDeck: (name: string) => {
            dispatch(reviewDeckRequest(name))
        },
        addDeck: (name: string) => {
            dispatch(addDeckRequest(name))
        }
    }
}

const CollectionPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CollectionPage)

export default CollectionPageContainer