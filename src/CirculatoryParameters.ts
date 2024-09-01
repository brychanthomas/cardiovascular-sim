import { Disease } from './Disease.js';
import { Parameter } from './Parameter.js';

export enum PARAM {
    R_p,
    R_a,
    C_a,
    rate,
    strokeVolume,
    systoleLength,
    dicroticLength,
    dicroticPeakFlow,
    aorticBackflow
}

const baseValues = {
    [PARAM.R_p]: 1,
    [PARAM.R_a]: 0.03,
    [PARAM.C_a]: 2,
    [PARAM.rate]: 53,
    [PARAM.strokeVolume]: 95,
    [PARAM.systoleLength]: 0.3,
    [PARAM.dicroticLength]: 0.05,
    [PARAM.dicroticPeakFlow]: 100,
    [PARAM.aorticBackflow]:-0.1
}

export class CirculatoryParameters {

    private parameters: { [id: number]: Parameter };

    constructor() {
        this.parameters = {}
        for (var param in PARAM) {
            this.parameters[param] = new Parameter(baseValues[param]);
        }
    }

    applyDiseases(list: Disease[]) {
        for (var i=0; i<list.length; i++) {
            let diseaseFactors = list[i].getFactors();
            var factor: any;
            for (factor in diseaseFactors) {
                this.getParameter(<PARAM>factor).setDiseaseFactor(diseaseFactors[factor]);
            }
        }
    }

    getParameter(id: PARAM) {
        return this.parameters[id];
    }

    getValue(id: PARAM) {
        return this.parameters[id].getValue();
    }

}