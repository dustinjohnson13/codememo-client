import {InMemoryDao} from "../../fakeData/InMemoryDao"
import DaoDelegatingDataService from "../DaoDelegatingDataService"

const service = new DaoDelegatingDataService(new InMemoryDao())

export default service