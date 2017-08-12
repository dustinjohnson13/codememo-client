import {SystemClock} from "../Domain";
import {DelegatingDataService} from "./DataService";

const clock = new SystemClock();
const service = new DelegatingDataService(clock);

export default service