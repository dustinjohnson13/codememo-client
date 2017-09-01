//@flow
import { InMemoryDao } from '../../fakeData/InMemoryDao'
import DaoDelegatingDataService from '../DaoDelegatingDataService'
import type { Clock } from '../APIDomain'

export class FrozenClock implements Clock {
  epochMilliseconds (): number {
    // 2016, January 1
    return 1451606400000
  }
}

const service = new DaoDelegatingDataService(new InMemoryDao(), new FrozenClock())

export default service