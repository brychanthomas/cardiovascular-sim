import { Parameter } from './Parameter.js'

export interface ParameterSummary {
    base: string,
    value: string,
    exerciseFactor: string,
    baroreflexFactor: string,
    diseaseFactors: string
}

export class SummarisableParameter extends Parameter {

    private unit: string = '';
    private exerciseFactorExplanation: string = '';
    private baroreflexFactorExplanation: string = '';
    private diseaseFactorExplanations: string[] = [];

    setExerciseFactorExplanation(exp: string) {
        this.exerciseFactorExplanation = exp;
    }

    setBaroreflexFactorExplanation(exp: string) {
        this.baroreflexFactorExplanation = exp;
    }

    setDiseaseFactorExplanations(exps: string[]) {
        this.diseaseFactorExplanations = exps;
    }

    getSummary(): ParameterSummary {
        var diseaseFactorText = '';
        for (var i = 0; i<this.diseaseFactorExplanations.length; i++) {
            diseaseFactorText += this.diseaseFactors[i] + 'x - ' + this.diseaseFactorExplanations[i] + '<br>';
        }
        return {
            base: this.baseValue + ' ' + this.unit,
            value: this.getValue() + ' ' + this.unit,
            exerciseFactor: this.exerciseFactor + 'x - ' + this.exerciseFactorExplanation,
            baroreflexFactor: this.baroreflexFactor + 'x - ' + this.baroreflexFactorExplanation,
            diseaseFactors: diseaseFactorText
        }
    }
}