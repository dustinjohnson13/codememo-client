class Collection {
    constructor(decks) {
        this.decks = decks;
    }
}

class Deck {
    constructor(name, cards) {
        this.name = name;
        this.cards = cards;
    }

    getNew() {
        return this.cards.filter((it) => it.isNew())
    }

    getDue() {
        return this.cards.filter((it) => it.isDue())
    }
}

class Card {
    constructor(question, answer, due) {
        this.question = question;
        this.answer = answer;
        this.due = due;
    }

    isNew() {
        return this.due === null
    }

    isDue() {
        return !this.isNew() && this.due < new Date().getTime();
    }
}

module.exports = {
    Collection, Deck, Card
};
