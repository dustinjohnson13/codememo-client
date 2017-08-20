//@flow
export default class Card {
    id: ?string
    deckId: string
    question: string
    answer: string
    due: ?number

    constructor(id: ?string, deckId: string, question: string, answer: string, due: ?number) {
        this.id = id
        this.deckId = deckId
        this.question = question
        this.answer = answer
        this.due = due
    }
}