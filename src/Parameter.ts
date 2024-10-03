export class Parameter {

    protected baseValue: number;
    protected diseaseFactors: number[] = [];
    protected diseaseAdditors: number[] = [];
    protected baroreflexFactor = 1;
    protected exerciseFactor = 1;

    constructor(base: number) {
        this.baseValue = base;
    }

    setDiseaseModifiers(factors: number[], additors: number[]) {
        this.diseaseFactors = factors;
        this.diseaseAdditors = additors;
        this.diseaseFactors.push(1);
        this.diseaseAdditors.push(0);
    }

    setBaroreflexFactor(f: number) {
        this.baroreflexFactor = f;
    }

    setExerciseFactor(f: number) {
        this.exerciseFactor = f;
    }

    getValue() {
        let added = (this.baseValue + this.baseValue * this.diseaseAdditors.reduce((a,b)=>a+b))
        return added * this.diseaseFactors.reduce((a,b)=>a*b) * this.baroreflexFactor * this.exerciseFactor;
    }
}