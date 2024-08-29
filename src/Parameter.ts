export class Parameter {

    private diseaseFactor = 1;
    private baroreflexFactor = 1;
    private exerciseFactor = 1;

    setDiseaseFactor(f: number) {
        this.diseaseFactor = f;
    }

    setBaroreflexFactor(f: number) {
        this.baroreflexFactor = f;
    }

    setExerciseFactor(f: number) {
        this.exerciseFactor = f;
    }

    getOverallFactor() {
        return this.diseaseFactor * this.baroreflexFactor * this.exerciseFactor;
    }
}