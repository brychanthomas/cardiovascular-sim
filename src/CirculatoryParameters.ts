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

export class CirculatoryParameters {
    // private R_pBase = 1;
    // private R_aBase = 1;
    // private C_aBase = 1;
    // private rateBase = 1;
    // private strokeVolumeBase = 1;
    // private systoleLengthBase = 1;
    // private dicroticLengthBase = 1;
    // private dicroticPeakFlowBase = 1;
    // private aorticBackflowBase = 1;

    private parameters;

    constructor() {
        this.parameters = {}
        for (var param in PARAM) {
            this.parameters[param] = new Parameter();
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

    getOverallFactor(id: PARAM) {
        return this.parameters[id].getOverallFactor();
    }

}