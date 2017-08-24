import {InMemoryDao} from "../../fakeData/InMemoryDao"
import DaoDelegatingDataService from "../DaoDelegatingDataService"

export class FrozenClock implements Clock {
    epochSeconds(): number {
        return 1
    }
}

const service = new DaoDelegatingDataService(new InMemoryDao(), new FrozenClock())

export default service