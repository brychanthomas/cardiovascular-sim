import { Disease } from './Disease.js';
import { Parameter } from './Parameter.js';

export enum PARAM {
    R_p,
    R_a,
    C_a,
    rate,
    systoleLength,
    dicroticLength,
    dicroticPeakFlow,
    aorticBackflow,
    msfp,
    rvr
}

const baseValues = {
    [PARAM.R_p]: 1,                // mmHg s/mL
    [PARAM.R_a]: 0.03,             // mmHg s/mL
    [PARAM.C_a]: 2,                // mL/mmHg
    [PARAM.rate]: 55,              // bpm
    [PARAM.systoleLength]: 0.3,    // s
    [PARAM.dicroticLength]: 0.05,  // s
    [PARAM.dicroticPeakFlow]: 100, // mL/s
    [PARAM.aorticBackflow]: -0.1,  // mL/s
    [PARAM.msfp]: 7,               // mmHg
    [PARAM.rvr]: 7/5000            // mmHg s/mL
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