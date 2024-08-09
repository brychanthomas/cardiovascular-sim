import { CirculatorySystem } from './CirculatorySystem.js';
import { Disease } from './Disease.js';
import { CirculatoryParameterFactors } from './CirculatoryParameterFactors.js';

export class Patient {

    private circulation: CirculatorySystem;
    private diseases: Disease[] = [];
    private baroreflexSetPoint = 93;

    constructor() {
        this.circulation = new CirculatorySystem();
    }

    /**
     * Update circulatory parameters and evaluate pressures for given exercise factor
     */
    computeSteadyState(exerciseFactor: number) {
        let pf = new CirculatoryParameterFactors();
        pf.applyDiseases(this.diseases);
        pf.setR_pFactor(1 - 0.6*exerciseFactor);
        pf.setC_aFactor(1 - 0.25*exerciseFactor);
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
}