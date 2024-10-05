/**
 * Stores parameter base values and factors/additors modifying it
 * and calculates the resulting value.
 */
export class Parameter {

    protected baseValue: number;
    protected diseaseFactors: number[] = [];
    protected diseaseAdditors: number[] = [];
    protected baroreflexFactor = 1;
    protected exerciseFactor = 1;

    constructor(base: number) {
        this.baseValue = base;
    }

    /**
     * Set modifiers affecting this parameter due to disease processes
     * @param factors array of disease modifiers parameter is multiplied by
     * @param additors array of disease modifiers added together, multiplied by base then added to base value before factors applied
     */
    setDiseaseModifiers(factors: number[], additors: number[]) {
        this.diseaseFactors = factors;
        this.diseaseAdditors = additors;
        this.diseaseFactors.push(1);
        this.diseaseAdditors.push(0);
    }

    /**
     * Set factor parameter is multiplied by due to baroreflex responses
     * @param f baroreflex factor
     */
    setBaroreflexFactor(f: number) {
        this.baroreflexFactor = f;
    }

    /**
     * Set factor parameter is multiplied by due to effects of exercise
     * @param f exercise factor
     */
    setExerciseFactor(f: number) {
        this.exerciseFactor = f;
    }

    /**
     * Combine base value with all the modifiers set to get a value for the parameter
     * @returns unrounded parameter value
     */
    getValue() {
        let added = (this.baseValue + this.baseValue * this.diseaseAdditors.reduce((a,b)=>a+b))
        return added * this.diseaseFactors.reduce((a,b)=>a*b) * this.baroreflexFactor * this.exerciseFactor;
    }
}