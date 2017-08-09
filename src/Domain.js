class Clock {
    constructor(epochSecondsRetriever) {
        this.epochSecondsRetriever = epochSecondsRetriever;
    }

    epochSeconds() {
        return this.epochSecondsRetriever();
    }
}

class Collection {
    constructor(decks) {
        this.decks = decks;
    }
}

class Deck {
    constructor(id, name, cards) {
        this.id = id;
        this.name = name;
        this.cards = cards;
    }

    getNew() {
        return this.cards.filter((it) => it.isNew())
    }

    getDue(clock) {
        return this.cards.filter((it) => it.isDue(clock))
    }
}

class Card {
    constructor(id, question, answer, due) {
        this.id = id;
        this.question = question;
        this.answer = answer;
        this.due = due;
    }

    isNew() {
        return this.due === null
    }

    isDue(clock) {
        return !this.isNew() && this.due < clock.epochSeconds();
    }
}

const FAIL = 'FAIL';
const HARD = 'HARD';
const GOOD = 'GOOD';
const EASY = 'EASY';

module.exports = {
    Clock, Collection, Deck, Card, FAIL, HARD, GOOD, EASY
};
