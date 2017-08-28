//@flow
import {InMemoryDao} from "../../fakeData/InMemoryDao"
import DaoDelegatingDataService from "../DaoDelegatingDataService"
import type {Clock} from "../APIDomain"

export class FrozenClock implements Clock {
    epochMilliseconds(): number {
        // 2016, January 1
        return 1451606400000
    }
}

export class SystemClock implements Clock {
    epochSeconds(): number {
        // 2016, January 1
        return 1451606400
    }
}

export class ArrayClock implements Clock {
    +times: Array<number>
    idx: number = 0

    constructor(times: Array<number>) {
        (this: any).times = times
    }

    epochSeconds(): number {
        return this.times[Math.min(this.idx++, this.times.length - 1)]
    }
}

const service = new DaoDelegatingDataService(new InMemoryDao(), new FrozenClock())

export default service