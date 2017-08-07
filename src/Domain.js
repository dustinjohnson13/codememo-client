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
    constructor(name, id, cards) {
        this.name = name;
        this.id = id;
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
    constructor(question, answer, due) {
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
