//@flow
export default class Card {
    +id: string
    +deckId: string
    +question: string
    +answer: string
    +goodInterval: number
    +due: number

    constructor(id: string, deckId: string, question: string, answer: string, goodInterval: number, due: number) {
        (this: any).id = id;
        (this: any).deckId = deckId;
        (this: any).question = question;
        (this: any).answer = answer;
        (this: any).goodInterval = goodInterval;
        (this: any).due = due;
    }
}