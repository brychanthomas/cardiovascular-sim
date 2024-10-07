import { Parameter } from './Parameter.js';
/**
 * Extension of Parameter class which stores parameter base values and factors to also
 * produce ParameterSummary objects.
 */
export class SummarisableParameter extends Parameter {
    constructor() {
        super(...arguments);
        this.unit = '';
        this.formattedName = '';
        this.description = '';
        this.exerciseFactorExplanation = '';
        this.baroreflexFactorExplanation = '';
        this.diseaseFactorExplanations = [];
        this.diseaseAdditorExplanations = [];
    }
    /**
     * Set unit of parameter
     * @param unit string unit
     */
    setUnit(unit) {
        this.unit = unit;
    }
    /**
     * Set HTML-formatted name for parameter
     * @param name HTML-formatted name
     */
    setFormattedName(name) {
        this.formattedName = name;
    }
    /**
     * Set description for parameter
     * @param desc description
     */
    setDescription(desc) {
        this.description = desc;
    }
    /**
     * Set exercise factor explanation text
     * @param exp text explaining why exercise is affecting parameter
     */
    setExerciseFactorExplanation(exp) {
        this.exerciseFactorExplanation = exp;
    }
    /**
     * Set baroreflex factor explanation text
     * @param exp text explaining why baroreflex is affecting parameter
     */
    setBaroreflexFactorExplanation(exp) {
        this.baroreflexFactorExplanation = exp;
    }
    /**
     * Set disease factor and additor explanations. Explanations must be given
     * in same order as factors and additors were set with setDiseaseModifiers
     * @param factorExps array of strings affecting factors
     * @param additorExps array of strings affecting additors
     */
    setDiseaseModifierExplanations(factorExps, additorExps) {
        this.diseaseFactorExplanations = factorExps;
        this.diseaseAdditorExplanations = additorExps;
    }
    /**
     * Get ParameterSummary object for Parameter
     * @returns ParameterSummary object for this parameter
     */
    getSummary() {
        var diseaseModifiers = [];
        for (var i = 0; i < this.diseaseAdditorExplanations.length; i++) {
            diseaseModifiers.push('(+)' + this.round(this.diseaseAdditors[i]) + 'x - ' + this.diseaseAdditorExplanations[i]);
        }
        for (var i = 0; i < this.diseaseFactorExplanations.length; i++) {
            diseaseModifiers.push('(×)' + this.round(this.diseaseFactors[i]) + ' - ' + this.diseaseFactorExplanations[i]);
        }
        return {
            name: this.formattedName,
            description: this.description,
            base: this.baseValue.toPrecision(3) + ' ' + this.unit,
            value: this.getValue().toPrecision(3) + ' ' + this.unit,
            exerciseFactor: (this.round(this.exerciseFactor) === 1) ? '' : '(×)' + this.round(this.exerciseFactor) + ' - ' + this.exerciseFactorExplanation,
            baroreflexFactor: (this.round(this.baroreflexFactor) === 1) ? '' : '(×)' + this.round(this.baroreflexFactor) + ' - ' + this.baroreflexFactorExplanation,
            diseaseFactors: diseaseModifiers
        };
    }
    /**
     * Round a number to 2 decimal places
     * @param val number
     * @returns rounded number
     */
    round(val) {
        return Math.round(val * 100) / 100;
    }
}
