import { Disease } from './Disease.js';
import { ParameterSummary, SummarisableParameter } from './SummarisableParameter.js';

export const PARAM = {
    R_p: 0,
    R_a: 1,
    C_a: 2,
    rate: 3,
    systoleLength: 4,
    dicroticLength: 5,
    dicroticPeakFlow: 6,
    aorticBackflow: 7,
    msfp: 8,
    rvr: 9,
    maxStrokeVolume: 10
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
    [PARAM.rvr]: 7/5000,           // mmHg s/mL
    [PARAM.maxStrokeVolume]: 125   // ml
}

const units = {
    [PARAM.R_p]: 'mmHg s/mL',
    [PARAM.R_a]: 'mmHg s/mL',
    [PARAM.C_a]: 'mL/mmHg',
    [PARAM.rate]: 'bpm',
    [PARAM.systoleLength]: 's',
    [PARAM.dicroticLength]: 's',
    [PARAM.dicroticPeakFlow]: 'mL/s',
    [PARAM.aorticBackflow]: 'mL/s',
    [PARAM.msfp]: 'mmHg',
    [PARAM.rvr]: 'mmHg s/mL',
    [PARAM.maxStrokeVolume]: 'ml'
}

const formattedNames = {
    [PARAM.R_p]: 'R<sub>p</sub>',
    [PARAM.R_a]: 'R<sub>a</sub>',
    [PARAM.C_a]: 'C<sub>a</sub>',
    [PARAM.rate]: 'HR',
    [PARAM.systoleLength]: 'T<sub>systole</sub>',
    [PARAM.dicroticLength]: 'T<sub>dicrotic</sub>',
    [PARAM.dicroticPeakFlow]: 'Dicrotic peak flow',
    [PARAM.aorticBackflow]: 'Aortic backflow',
    [PARAM.msfp]: 'MSFP',
    [PARAM.rvr]: 'RVR',
    [PARAM.maxStrokeVolume]: 'SV<sub>max</sub>'
}

const descriptions = {
    [PARAM.R_p]: 'Peripheral resistance',
    [PARAM.R_a]: 'Resistance of proximal arteries',
    [PARAM.C_a]: 'Capacitance of proximal arteries',
    [PARAM.rate]: 'Heart rate',
    [PARAM.systoleLength]: 'Length of mechanical systole',
    [PARAM.dicroticLength]: 'Time aortic valve takes to close after pressure gradient reverses',
    [PARAM.dicroticPeakFlow]: 'Peak reverse flow before aortic valve closes',
    [PARAM.aorticBackflow]: 'Constant reverse flow due to imperfect closing of aortic valve',
    [PARAM.msfp]: 'Mean systemic filling pressure',
    [PARAM.rvr]: 'Resistance to venous return',
    [PARAM.maxStrokeVolume]: 'Maximum achievable stroke volume'
}

export class CirculatoryParameters {

    private parameters: { [id: number]: SummarisableParameter };

    constructor() {
        this.parameters = {}
        for (const param of Object.values(PARAM)) {
            this.parameters[param] = new SummarisableParameter(baseValues[param]);
            this.parameters[param].setUnit(units[param]);
            this.parameters[param].setFormattedName(formattedNames[param]);
            this.parameters[param].setDescription(descriptions[param]);
        }
    }

    applyDiseases(diseases: Disease[]) {
        var param: any;
        for (param in Object.values(PARAM)) { // for each parameter
            var factors = [];
            var diseaseNames = [];
            for (var i=0; i<diseases.length; i++) { // for each disease
                let diseaseFactors = diseases[i].getFactors();
                if (param in diseaseFactors) { // if disease modifies parameter
                    factors.push(diseaseFactors[param]);
                    diseaseNames.push(diseases[i].getName());
                }
            }
            this.getParameter(param).setDiseaseFactors(factors);
            this.getParameter(param).setDiseaseFactorExplanations(diseaseNames);
        }
    }

    getParameter(id: number) {
        return this.parameters[id];
    }

    getValue(id: number) {
        return this.parameters[id].getValue();
    }

    getAllParameterSummaries() {
        var summaries: {[id: number]: ParameterSummary} = {};
        var param: any;
        for (param in Object.values(PARAM)) {
            summaries[param] = this.getParameter(param).getSummary();
        }
        return summaries;
    }

}