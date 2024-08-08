import { CirculatorySystem } from './CirculatorySystem.js';
import { Disease } from './Disease.js';

export class Patient {

    private circulation: CirculatorySystem;
    private diseases: Disease[] = [];
    private exerciseFactor: number = 0;

    constructor() {
        this.circulation = new CirculatorySystem();
    }

    /**
     * Update circulatory parameters and evaluate pressures
     */
    computeSteadyState() {
        this.circulation.evaluatePressures();
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