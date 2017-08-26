//@flow
import {InMemoryDao} from "../../fakeData/InMemoryDao"
import DaoDelegatingDataService from "../DaoDelegatingDataService"
import type {Clock} from "../APIDomain"

export class FrozenClock implements Clock {
    epochSeconds(): number {
        // 2016, January 1
        return 1451606400
    }
}

const service = new DaoDelegatingDataService(new InMemoryDao(), new FrozenClock())

export default service