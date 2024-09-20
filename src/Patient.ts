import { CirculatorySystem } from './CirculatorySystem.js';
import { Disease } from './Disease.js';
import { CirculatoryParameters, PARAM } from './CirculatoryParameters.js';
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
    private diseases: Disease[] = [new AorticRegurguitation()];

    constructor() {
        this.circulation = new CirculatorySystem();
    }

    /**
     * Update circulatory parameters and evaluate pressures for given exercise factor
     */
    computeSteadyState(exerciseFactor: number) {
        let parameters = new CirculatoryParameters();
        parameters.applyDiseases(this.diseases);
        parameters.getParameter(PARAM.R_p).setExerciseFactor(1 - 0.81*exerciseFactor); // TPR drops to 25% = 0.19(vasodilation)*1.33(splanchnic vasoconstriction)
        parameters.getParameter(PARAM.R_p).setExerciseFactorExplanation("vasodilation of arteries supplying exercising muscles (functional hyperaemia)");
        parameters.getParameter(PARAM.rvr).setExerciseFactor(1 - 0.3*exerciseFactor);
        parameters.getParameter(PARAM.rvr).setExerciseFactorExplanation("muscle pump effect due to movement of muscles near veins");
        //pf.setC_aFactor(1 - 0.25*exerciseFactor);
        this.circulation.applyParameters(parameters);
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

    getCirculatoryParameterSummaries() {
        return this.circulation.getParameterSummaries();
    }

    getCirculatoryOutputSummaries() {
        return this.circulation.getOutputSummaries();
    }
}