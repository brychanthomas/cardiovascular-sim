import { CirculatorySystem } from './CirculatorySystem.js';
import { Disease } from './Disease.js';
import { ClinicalSigns } from './ClinicalSigns.js';

/**
 * Represents a human patient with a cardiovascular system that can carry 
 * out variable intensity exercise and suffer from diseases
 */
export class Patient {

    private circulation: CirculatorySystem;
    private diseases: Disease[] = [];
    private diseaseString: string;
    private clinicalSigns: string[] = [];

    constructor() {
        this.circulation = new CirculatorySystem();
    }

    /**
     * Update circulatory parameters and calculate outputs and timeseries
     * for a given exercise factor
     * @param exerciseFactor intensity of exercise from 0 to 1
     */
    computeSteadyState(exerciseFactor: number) {
        this.circulation.applyDiseases(this.diseases);
        this.circulation.setExerciseFactor(exerciseFactor);
        this.circulation.baroreflex();
    }

    /**
     * Get steady state timeseries of pressure in the aorta over a single 
     * beat after it has been calculated by computeSteadyState
     * @returns object with 't' property for timepoints and 'p' property for corresponding pressure
     */
    getAorticPressureTimeseries() {
        return this.circulation.getAorticPressureTimeseries();
    }

    /**
     * Get timeseries of flow through the aortic valve over a single beat
     * @returns object with 't' property for timepoints and 'f' property for corresponding flow
     */
    getAorticValveFlowTimeseries() {
        return this.circulation.getAorticValveFlowTimeseries();
    }

    /**
     * Get ParameterSummary object for each circulatory parameter
     * @returns object mapping parameter ID to ParameterSummary object for each parameter
     */
    getCirculatoryParameterSummaries() {
        return this.circulation.getParameterSummaries();
    }

    /**
     * Get OutputSummary object for each circulatory output value
     * @returns object mapping output ID to OutputSummary object for each output
     */
    getCirculatoryOutputSummaries() {
        return this.circulation.getOutputSummaries();
    }

    /**
     * Get clinical signs for current disease state
     * @returns array of strings, each of which is the name of a clinical sign
     */
    getClinicalSigns() {
        return this.clinicalSigns;
    }

    /**
     * Update clinical signs by evaluating parameters and outputs for 
     * patient at rest and at 100% intensity exercise
     */
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

    /**
     * Set which diseases patient is suffering from
     * @param ds list of Disease objects
     */
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