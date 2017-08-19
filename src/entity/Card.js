//@flow
export default class Card {
    id: ?number
    deckId: number
    question: string
    answer: string
    due: ?number

    constructor(id: ?number, deckId: number, question: string, answer: string, due: ?number) {
        this.id = id
        this.deckId = deckId
        this.question = question
        this.answer = answer
        this.due = due
    }
}