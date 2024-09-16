export class Parameter {

    protected baseValue: number;
    protected diseaseFactors: number[] = [];
    protected baroreflexFactor = 1;
    protected exerciseFactor = 1;

    constructor(base: number) {
        this.baseValue = base;
    }

    setDiseaseFactors(fs: number[]) {
        this.diseaseFactors = fs;
        this.diseaseFactors.push(1);
    }

    setBaroreflexFactor(f: number) {
        this.baroreflexFactor = f;
    }

    setExerciseFactor(f: number) {
        this.exerciseFactor = f;
    }

    getValue() {
        return this.baseValue * this.diseaseFactors.reduce((a,b)=>a*b) * this.baroreflexFactor * this.exerciseFactor;
    }
}