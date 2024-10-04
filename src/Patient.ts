import { CirculatorySystem } from './CirculatorySystem.js';
import { Disease } from './Disease.js';
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

    getAorticPressureTimeseries() {
        return this.circulation.getAorticPressureTimeseries();
    }

    getAorticValveFlowTimeseries() {
        return this.circulation.getAorticValveFlowTimeseries();
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
        let c = new CirculatorySystem();
        c.applyDiseases(this.diseases);
        c.setExerciseFactor(0);
        c.baroreflex();
        let outsrest = c.getOutputValues();
        let paramsrest = c.getParameterValues();
        c.setExerciseFactor(1);
        c.baroreflex();
        let outsexer = c.getOutputValues();
        let paramsexer = c.getParameterValues();
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