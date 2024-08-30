import { Disease } from './Disease.js';
import { Parameter } from './Parameter.js';

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
        this.parameters = {
            "R_p": new Parameter(), //change key to enum?
            "R_a": new Parameter(),
            "C_a": new Parameter(),
            "rate": new Parameter(),
            "strokeVolume": new Parameter(),
            "systoleLength": new Parameter(),
            "dicroticLength": new Parameter(),
            "dicroticPeakFlow": new Parameter(),
            "aorticBackflow": new Parameter()
        }
    }

    applyDiseases(list: Disease[]) {
        for (var i=0; i<list.length; i++) {
           let diseaseFactors = list[i].getFactors();
           for (var factor in diseaseFactors) {
            this.getParameter(factor).setDiseaseFactor(diseaseFactors[factor]);
           }
        }
    }

    getParameter(id: string) {
        return this.parameters[id];
    }

    getOverallFactor(id: string) {
        return this.parameters[id].getOverallFactor();
    }

}