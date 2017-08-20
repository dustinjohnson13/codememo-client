//@flow
export default class Collection {
    id: ?string
    userId: number

    constructor(id: ?string, userId: number) {
        this.id = id
        this.userId = userId
    }
}