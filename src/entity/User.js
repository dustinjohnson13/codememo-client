//@flow
export default class User {
    id: ?number
    email: string

    constructor(id?: number, email: string) {
        this.id = id
        this.email = email
    }

}