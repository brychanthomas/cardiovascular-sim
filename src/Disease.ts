import { PARAM } from './CirculatoryParameters.js';

export abstract class Disease {

    protected parameterFactors: { [id: number] : number };

    getFactors() {
        return this.parameterFactors;
    }

    abstract getName(): string;

}



export class Atherosclerosis extends Disease {
    parameterFactors = {
        [PARAM.C_a]: 0.7,
        [PARAM.R_a]: 1.2,
        [PARAM.R_p]: 1.2
    }

    getName() { return "Atherosclerosis" }
}

export class AorticRegurguitation extends Disease {
    parameterFactors = {
        [PARAM.aorticBackflow]: 400
    }

    getName() { return "Aortic regurguitation" }
}