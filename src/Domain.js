// @flow
export interface Clock {
    epochSeconds(): number;
}

export class SystemClock {
    epochSeconds(): number {
        return new Date().getTime();
    }
}

export class Collection {
    decks: Array<Deck>;

    constructor(decks: Array<Deck>) {
        this.decks = decks;
    }
}

export class Deck {

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

export class Card {
    id: string;
    question: string;
    answer: string;
    due: ?number;

    constructor(id: string, question: string, answer: string, due: ?number) {
        this.id = id;
        this.question = question;
        this.answer = answer;
        this.due = due;
    }

    isNew() {
        return this.due === null
    }

    isDue(clock: Clock) {
        return this.due && this.due < clock.epochSeconds();
    }
}

export const FAIL = 'FAIL';
export const HARD = 'HARD';
export const GOOD = 'GOOD';
export const EASY = 'EASY';
