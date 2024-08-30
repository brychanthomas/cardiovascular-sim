import { CirculatorySystem } from './CirculatorySystem.js';
import { Disease } from './Disease.js';
import { CirculatoryParameters } from './CirculatoryParameters.js';
import { AorticRegurguitation, Atherosclerosis } from './Diseases.js';

interface Parameter {
    value: number,
    unit: string,
    changes: string[]
}

export interface ParameterValues {
    R_p: Parameter,
    R_a: Parameter,
    C_a: Parameter,
    rate: Parameter,
    strokeVolume: Parameter,
    co: Parameter,
    map: Parameter,
    pp: Parameter,
    pressureString: string
}

export class Patient {

    private circulation: CirculatorySystem;
    private diseases: Disease[] = [];

    constructor() {
        this.circulation = new CirculatorySystem();
    }

    /**
     * Update circulatory parameters and evaluate pressures for given exercise factor
     */
    computeSteadyState(exerciseFactor: number) {
        let pf = new CirculatoryParameters();
        pf.applyDiseases(this.diseases);
        pf.getParameter("R_p").setExerciseFactor(1 - 0.75*exerciseFactor);
        //pf.setC_aFactor(1 - 0.25*exerciseFactor);
        this.circulation.applyParameterFactors(pf);
        this.circulation.baroreflex();
    }

    getAorticPressureSequence() {
        return this.circulation.getAorticPressureSequence();
    }

    getAorticValveFlowSequence() {
        return this.circulation.getAorticValveFlowSequence();
    }

    getPressureString() {
        return this.circulation.getPressureString();
    }

    getMAP() {
        return this.circulation.getMAP();
    }

    /**
     * Get object with raw values of parameter values as well as descriptions
     * of changes from the base
     */
    getParameterValuesAndChanges(): ParameterValues {
        let values = this.circulation.getParameterValues();
        return {
            R_p: {value:values.R_p, unit:'mmHg s/mL', changes:[]},
            R_a: {value:values.R_a, unit:'mmHg s/mL', changes:[]},
            C_a: {value:values.C_a, unit:'mL/mmHg', changes:[]},
            rate: {value:values.rate, unit:'bpm', changes:[]},
            strokeVolume: {value:values.strokeVolume, unit:'mL', changes:[]},
            co: {value: values.co, unit:'L/min', changes:[]},
            map: {value:this.getMAP(), unit: 'mmHg', changes:[]},
            pp: {value:this.circulation.getPP(), unit: 'mmHg', changes:[]},
            pressureString: this.getPressureString()
        }
    }
}