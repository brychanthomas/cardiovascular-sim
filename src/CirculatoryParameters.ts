import { Disease } from './Disease.js';
import { ParameterSummary, SummarisableParameter } from './SummarisableParameter.js';

/** mapping of readable parameter name to numerical ID (like an enum) */
export const PARAM = {
    R_p: 0,
    R_a: 1,
    C_a: 2,
    rate: 3,
    systoleLength: 4,
    dicroticLength: 5,
    aorticBackflow: 6,
    msfp: 7,
    rvr: 8,
    maxStrokeVolume: 9,
    baroreflexSetPoint: 10
}

/** Mapping of parameter ID to base value */
const baseValues = {
    [PARAM.R_p]: 1,                // mmHg s/mL
    [PARAM.R_a]: 0.03,             // mmHg s/mL
    [PARAM.C_a]: 2,                // mL/mmHg
    [PARAM.rate]: 55,              // bpm
    [PARAM.systoleLength]: 0.3,    // s
    [PARAM.dicroticLength]: 0.05,  // s
    [PARAM.aorticBackflow]: -0.1,  // mL/s
    [PARAM.msfp]: 7.25,            // mmHg
    [PARAM.rvr]: 7/5000,           // mmHg s/mL
    [PARAM.maxStrokeVolume]: 125,  // ml
    [PARAM.baroreflexSetPoint]: 93 // mmHg
}

/** Mapping of parameter ID to unit */
const units = {
    [PARAM.R_p]: 'mmHg s/mL',
    [PARAM.R_a]: 'mmHg s/mL',
    [PARAM.C_a]: 'mL/mmHg',
    [PARAM.rate]: 'bpm',
    [PARAM.systoleLength]: 's',
    [PARAM.dicroticLength]: 's',
    [PARAM.aorticBackflow]: 'mL/s',
    [PARAM.msfp]: 'mmHg',
    [PARAM.rvr]: 'mmHg s/mL',
    [PARAM.maxStrokeVolume]: 'ml',
    [PARAM.baroreflexSetPoint]: 'mmHg'
}

/** Mapping of parameter ID to HTML-formatted name */
const formattedNames = {
    [PARAM.R_p]: 'R<sub>p</sub>',
    [PARAM.R_a]: 'R<sub>a</sub>',
    [PARAM.C_a]: 'C<sub>a</sub>',
    [PARAM.rate]: 'HR',
    [PARAM.systoleLength]: 'T<sub>systole</sub>',
    [PARAM.dicroticLength]: 'T<sub>dicrotic</sub>',
    [PARAM.aorticBackflow]: 'Aortic backflow',
    [PARAM.msfp]: 'MSFP',
    [PARAM.rvr]: 'RVR',
    [PARAM.maxStrokeVolume]: 'SV<sub>max</sub>',
    [PARAM.baroreflexSetPoint]: 'SP'
}

/** Mapping of parameter ID to description */
const descriptions = {
    [PARAM.R_p]: 'Peripheral resistance',
    [PARAM.R_a]: 'Resistance of proximal arteries',
    [PARAM.C_a]: 'Capacitance of proximal arteries',
    [PARAM.rate]: 'Heart rate',
    [PARAM.systoleLength]: 'Length of mechanical systole',
    [PARAM.dicroticLength]: 'Time aortic valve takes to close after pressure gradient reverses',
    [PARAM.aorticBackflow]: 'Constant reverse flow due to imperfect closing of aortic valve',
    [PARAM.msfp]: 'Mean systemic filling pressure',
    [PARAM.rvr]: 'Resistance to venous return',
    [PARAM.maxStrokeVolume]: 'Maximum achievable stroke volume - depends on ventricular volume and ejection fraction',
    [PARAM.baroreflexSetPoint]: 'Baroreflex set point'
}

/**
 * Stores all SummarisableParameter objects needed by CirculatorySystem
 */
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

    /**
     * Adjust parameter values (via disease factor and disease additor) based 
     * upon list of active Disease objects - overwrites any diseases previously
     * applied
     * @param diseases list of Disease objects
     */
    applyDiseases(diseases: Disease[]) {
        var param: any;
        for (param in Object.values(PARAM)) { // for each parameter
            var factors = [];
            var factorDiseaseNames = [];
            var additors = [];
            var additorDiseaseNames = [];
            for (var i=0; i<diseases.length; i++) { // for each disease
                let diseaseFactors = diseases[i].getFactors();
                if (param in diseaseFactors) { // if disease modifies parameter
                    factors.push(diseaseFactors[param]);
                    factorDiseaseNames.push(diseases[i].getName() + ' (' + diseases[i].getSeverity()+diseases[i].getSeverityUnit()+')');
                }
                let diseaseAdditors = diseases[i].getAdditors();
                if (param in diseaseAdditors) { // if disease modifies parameter
                    additors.push(diseaseAdditors[param]);
                    additorDiseaseNames.push(diseases[i].getName() + ' (' + diseases[i].getSeverity()+diseases[i].getSeverityUnit()+')');
                }
            }
            this.getParameter(param).setDiseaseModifiers(factors, additors);
            this.getParameter(param).setDiseaseModifierExplanations(factorDiseaseNames, additorDiseaseNames);
        }
    }

    /**
     * Get SummarisableParameter object from parameter ID
     * @param id parameter ID
     * @returns SummarisableParameter object
     */
    getParameter(id: number) {
        return this.parameters[id];
    }

    /**
     * Get numerical parameter value from parameter ID
     * @param id parameter ID
     * @returns numerical value of parameter
     */
    getValue(id: number) {
        return this.parameters[id].getValue();
    }

    /**
     * Get ParameterSummary object for every parameter
     * @returns object mapping parameter ID to ParameterSummary for every parameter
     */
    getAllParameterSummaries() {
        var summaries: {[id: number]: ParameterSummary} = {};
        var param: any;
        for (param in Object.values(PARAM)) {
            summaries[param] = this.getParameter(param).getSummary();
        }
        return summaries;
    }

}