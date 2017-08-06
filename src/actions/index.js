export const showCollections = () => {
    return {
        type: 'SHOW_COLLECTIONS'
    }
};

export const reviewDeck = name => {
    return {
        type: 'REVIEW_DECK',
        name
    }
};

export const addDeck = name => {
    return {
        type: 'ADD_NEW_DECK',
        name
    }
};