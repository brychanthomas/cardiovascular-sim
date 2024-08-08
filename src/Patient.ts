import { CirculatorySystem } from './CirculatorySystem.js';
import { Disease } from './Disease.js';

export class Patient {

    private circulation: CirculatorySystem;
    private diseases: Disease[] = [];
    private exerciseFactor: number = 0;
    private baroreflexSetPoint = 93;

    constructor() {
        this.circulation = new CirculatorySystem();
    }

    /**
     * Update circulatory parameters and evaluate pressures
     */
    computeSteadyState() {
        let e = 1;
        this.circulation.setR_pFactor(1 - 0.6*e);
        this.circulation.setC_aFactor(1 - 0.25*e);
        this.baroreflex();
    }

    baroreflex() {
        this.circulation.evaluatePressures();
        var map = this.circulation.getMAP();
        var reflex_coeff = 0;
        var set_point = -1;
        while(map < set_point-1 || map > set_point+1) {
            set_point = this.baroreflexSetPoint + 15*reflex_coeff;
            if (map < set_point-1) {
                reflex_coeff += Math.min((set_point-map)*0.01, 0.1);
            } else if (map > set_point+1) {
                reflex_coeff -= Math.min((map-set_point)*0.01, 0.1);
            }
            this.circulation.setStrokeVolumeFactor(1 + 0.3*reflex_coeff);
            this.circulation.setRateFactor(1 + 2*reflex_coeff);
            this.circulation.setSystoleLengthFactor(1 - 0.33*reflex_coeff);
            this.circulation.evaluatePressures();
            map = this.circulation.getMAP();
        }
        console.log(reflex_coeff);
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