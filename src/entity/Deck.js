//@flow
export default class Deck {
    id: ?string
    collectionId: string
    name: string

    constructor(id: ?string, collectionId: string, name: string) {
        this.id = id
        this.collectionId = collectionId
        this.name = name
    }
}