//@flow
export default class Collection {
    id: ?string
    userId: string

    constructor(id: ?string, userId: string) {
        this.id = id
        this.userId = userId
    }
}