// @flow
export interface Clock {
    epochSeconds(): number;
}

class SystemClock {
    epochSeconds(): number {
        return new Date().getTime();
    }
}

class Collection {
    decks: Array<Deck>;

    constructor(decks: Array<Deck>) {
        this.decks = decks;
    }
}

class Deck {

    id: string;
    name: string;
    cards: Array<Card>;

    constructor(id: string, name: string, cards: Array<Card>) {
        this.id = id;
        this.name = name;
        this.cards = cards;
    }

    getNew() {
        return this.cards.filter((it) => it.isNew())
    }

    getDue(clock: Clock) {
        return this.cards.filter((it) => it.isDue(clock))
    }
}

class Card {
    id: string;
    question: string;
    answer: string;
    due: number;

    constructor(id: string, question: string, answer: string, due: number) {
        this.id = id;
        this.question = question;
        this.answer = answer;
        this.due = due;
    }

    isNew() {
        return this.due === null
    }

    isDue(clock: Clock) {
        return !this.isNew() && this.due < clock.epochSeconds();
    }
}

const FAIL = 'FAIL';
const HARD = 'HARD';
const GOOD = 'GOOD';
const EASY = 'EASY';

module.exports = {
    SystemClock, Collection, Deck, Card, FAIL, HARD, GOOD, EASY
};
