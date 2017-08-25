//@flow
export default class Deck {
    +id: string
    +userId: string
    +name: string

    constructor(id: string, userId: string, name: string) {
        (this: any).id = id;
        (this: any).userId = userId;
        (this: any).name = name;
    }
}