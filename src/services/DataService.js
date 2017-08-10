import FakeDataService from "../fakeData/FakeDataService";

export default class {

    constructor(clock) {
        this.timeoutDelay = 250;
        this.fakeDataService = new FakeDataService(clock);
    }

    addDeck(name) {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.fakeDataService.addDeck(name).then(resolve), this.timeoutDelay);
        });
    }

    fetchCollection() {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.fakeDataService.fetchCollection().then(resolve), this.timeoutDelay);
        });
    }

    fetchDeck(name) {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.fakeDataService.fetchDeck(name).then(resolve), this.timeoutDelay);
        });
    }

    fetchCards(ids) {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.fakeDataService.fetchCards(ids).then(resolve), this.timeoutDelay);
        });
    }

    answerCard(id, answer){
        return new Promise((resolve, reject) => {
            setTimeout(() => this.fakeDataService.answerCard(id, answer).then(resolve), this.timeoutDelay);
        });
    }
};