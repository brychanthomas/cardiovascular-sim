import { CirculatorySystem } from './CirculatorySystem.js';
import { Disease } from './Disease.js';
import { CirculatoryParameters, PARAM } from './CirculatoryParameters.js';
import { ClinicalSigns } from './ClinicalSigns.js';

export class Patient {

    private circulation: CirculatorySystem;
    private diseases: Disease[] = [];
    private diseaseString: string;
    private clinicalSigns: string[] = [];

    constructor() {
        this.circulation = new CirculatorySystem();
    }

    /**
     * Update circulatory parameters and evaluate pressures for given exercise factor
     */
    computeSteadyState(exerciseFactor: number) {
        this.circulation.applyDiseases(this.diseases);
        this.circulation.setExerciseFactor(exerciseFactor);
        this.circulation.baroreflex();
    }

    getAorticPressureSequence() {
        return this.circulation.getAorticPressureSequence();
    }

    getAorticValveFlowSequence() {
        return this.circulation.getAorticValveFlowSequence();
    }

    getCirculatoryParameterSummaries() {
        return this.circulation.getParameterSummaries();
    }

    getCirculatoryOutputSummaries() {
        return this.circulation.getOutputSummaries();
    }

    getClinicalSigns() {
        return this.clinicalSigns;
    }

    private updateClinicalSigns() {
        this.circulation.applyDiseases(this.diseases);
        this.circulation.setExerciseFactor(0);
        this.circulation.baroreflex();
        let outsrest = this.circulation.getOutputValues();
        let paramsrest = this.circulation.getParameterValues();
        this.circulation.setExerciseFactor(1);
        this.circulation.baroreflex();
        let outsexer = this.circulation.getOutputValues();
        let paramsexer = this.circulation.getParameterValues();
        this.clinicalSigns = ClinicalSigns.getSigns(paramsrest, outsrest, paramsexer, outsexer);
    }

    setDiseases(ds: Disease[]) {
        let f = (d)=>d.getName()+d.getSeverity();
        //only if diseases/severities have changed
        if (ds.map(f).sort().toString() !== this.diseaseString) {
            this.diseases = ds;
            this.diseaseString = ds.map(f).sort().toString();
            this.updateClinicalSigns();
        }
    }
}