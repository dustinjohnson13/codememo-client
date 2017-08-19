//@flow
export default class Deck {
    id: ?number
    collectionId: number
    name: string

    constructor(id: ?number, collectionId: number, name: string) {
        this.id = id
        this.collectionId = collectionId
        this.name = name
    }
}