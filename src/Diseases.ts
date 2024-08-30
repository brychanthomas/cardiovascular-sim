import { PARAM } from './CirculatoryParameters.js';
import { Disease } from './Disease.js';

export class Atherosclerosis extends Disease {
    parameterFactors = {
        [PARAM.C_a]: 0.7,
        [PARAM.R_a]: 1.2,
        [PARAM.R_p]: 1.2
    }
}

export class AorticRegurguitation extends Disease {
    parameterFactors = {
        [PARAM.aorticBackflow]: 400
    }
}
