import {connect} from 'react-redux'
import {collectionPage} from '../actions/index'
import ReviewPage from '../ReviewPage'

const mapStateToProps = (state, ownProps) => {
    const currentTime = ownProps.clock.epochSeconds();
    const deck = state.reviewPage.deck;

    const deckName = deck.name;
    const totalCount = deck.cards.length;
    const newCount = deck.cards.filter(it => it.due === null).length;
    const dueCount = deck.cards.filter(it => it.due && currentTime > it.due).length;

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
            dispatch(collectionPage());
        }
    }
};

const ReviewPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReviewPage);

export default ReviewPageContainer