export class Parameter {

    private baseValue;
    private diseaseFactor = 1;
    private baroreflexFactor = 1;
    private exerciseFactor = 1;

    constructor(base: number) {
        this.baseValue = base;
    }

    setDiseaseFactor(f: number) {
        this.diseaseFactor = f;
    }

    setBaroreflexFactor(f: number) {
        this.baroreflexFactor = f;
    }

    setExerciseFactor(f: number) {
        this.exerciseFactor = f;
    }

    getValue() {
        return this.baseValue * this.diseaseFactor * this.baroreflexFactor * this.exerciseFactor;
    }
}