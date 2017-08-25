//@flow
export default class User {
    +id: string
    +email: string

    constructor(id: string, email: string) {
        (this: any).id = id;
        (this: any).email = email;
    }

}