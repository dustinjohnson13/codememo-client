import {connect} from 'react-redux'
import {fetchCollection} from '../actions/index'
import ReviewPage from '../ReviewPage'

const mapStateToProps = (state, ownProps) => {
    const currentTime = ownProps.clock.epochSeconds();
    const deckName = state.collectionPage.deck.name;
    const totalCount = state.collectionPage.deck.cards.length;
    const newCount = state.collectionPage.deck.cards.filter(it => it.due === null).length;
    const dueCount = state.collectionPage.deck.cards.filter(it => it.due && currentTime > it.due).length;

    return {
        deckName: deckName,
        newCount: newCount,
        dueCount: dueCount,
        totalCount: totalCount
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