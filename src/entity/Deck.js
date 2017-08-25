//@flow
export default class Deck {
    id: string
    userId: string
    name: string

    constructor(id: string, userId: string, name: string) {
        this.id = id
        this.userId = userId
        this.name = name
    }
}