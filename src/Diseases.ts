import { Disease } from './Disease.js';

export class Atherosclerosis extends Disease {
    parameterFactors = {
        "C_a": 0.7,
        "R_a": 1.2,
        "R_p": 1.2
    }
}

export class AorticRegurguitation extends Disease {
    parameterFactors = {
        "aorticBackflow": 400
    }
}
