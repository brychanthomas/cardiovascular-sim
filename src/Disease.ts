import { PARAM } from './CirculatoryParameters.js';

export abstract class Disease {

    protected parameterFactorChanges: { [id: number] : number };
    protected severity: number = 1;

    getFactors() {
        var factors: { [id: number] : number } = {};
        for (var id in this.parameterFactorChanges) {
            factors[id] = 1 + this.parameterFactorChanges[id]*this.severity;
        }
        return factors;
    }

    setSeverity(s: number) {
        this.severity = s; 
    }

    abstract getName(): string;

}



export class Atherosclerosis extends Disease {
    parameterFactorChanges = {
        [PARAM.C_a]: -0.3,
        [PARAM.R_a]: +0.2,
        //[PARAM.R_p]: 1.2
    }

    getName() { return "Atherosclerosis" }
}

export class AorticRegurguitation extends Disease {
    parameterFactorChanges = {
        [PARAM.aorticBackflow]: +399
    }

    getName() { return "Aortic regurguitation" }
}