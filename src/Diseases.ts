import { Disease } from './Disease.js';

export class Atherosclerosis extends Disease {
    getC_aFactor() { return 0.7; }
    getR_aFactor() { return 1.2; }
    getR_pFactor() { return 1.2; }
}

export class AorticRegurguitation extends Disease {
    getAorticBackflowFactor() { return 400; }
}
