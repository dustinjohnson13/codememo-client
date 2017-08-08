import FakeDataService from "../fakeData/FakeDataService";

export default class {

    constructor(clock) {
        this.timeoutDelay = 250;
        this.fakeDataService = new FakeDataService(clock);
    }

    addDeck(name) {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.fakeDataService.addDeck(name).then(it => resolve(it)), this.timeoutDelay);
        });
    }

    fetchCollection() {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.fakeDataService.fetchCollection().then(it => resolve(it)), this.timeoutDelay);
        });
    }

    fetchDeck(name) {
        return new Promise((resolve, reject) => {
            setTimeout(() => this.fakeDataService.fetchDeck(name).then(it => resolve(it)), this.timeoutDelay);
        });
    }
};