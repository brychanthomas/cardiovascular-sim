import { CirculatorySystem } from './CirculatorySystem.js';
import { Disease } from './Disease.js';
import { CirculatoryParameters, PARAM } from './CirculatoryParameters.js';
import { AorticRegurguitation, Atherosclerosis } from './Disease.js';

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
        let parameters = new CirculatoryParameters();
        parameters.applyDiseases(this.diseases);
        parameters.getParameter(PARAM.R_p).setExerciseFactor(1 - 0.81*exerciseFactor); // TPR drops to 25% = 0.19(vasodilation)*1.33(splanchnic vasoconstriction)
        parameters.getParameter(PARAM.R_p).setExerciseFactorExplanation("exercise: vasodilation of arteries supplying exercising muscles (functional hyperaemia)");
        parameters.getParameter(PARAM.rvr).setExerciseFactor(1 - 0.3*exerciseFactor);
        parameters.getParameter(PARAM.rvr).setExerciseFactorExplanation("exercise: muscle pump effect due to movement of muscles near veins");
        parameters.getParameter(PARAM.baroreflexSetPoint).setExerciseFactor(1 + (4/93)*exerciseFactor);
        parameters.getParameter(PARAM.baroreflexSetPoint).setExerciseFactorExplanation("exercise: resetting of baroreceptors, possibly due to competition for input to NTS from joint and position sensors");
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

    setDiseases(ds: Disease[]) {
        this.diseases = ds;
    }
}