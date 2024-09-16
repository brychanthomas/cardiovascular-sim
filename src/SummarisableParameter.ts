import { Parameter } from './Parameter.js'

export interface ParameterSummary {
    name: string,
    base: string,
    value: string,
    exerciseFactor: string,
    baroreflexFactor: string,
    diseaseFactors: string
}

export class SummarisableParameter extends Parameter {

    private unit: string = '';
    private formattedName: string = '';
    private exerciseFactorExplanation: string = '';
    private baroreflexFactorExplanation: string = '';
    private diseaseFactorExplanations: string[] = [];

    setUnit(unit: string) {
        this.unit = unit;
    }

    setFormattedName(name: string) {
        this.formattedName = name;
    }

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
            name: this.formattedName,
            base: this.baseValue.toPrecision(3) + ' ' + this.unit,
            value: this.getValue().toPrecision(3) + ' ' + this.unit,
            exerciseFactor: (this.round(this.exerciseFactor) === 1) ? '' : this.round(this.exerciseFactor) + 'x - ' + this.exerciseFactorExplanation,
            baroreflexFactor: (this.round(this.baroreflexFactor) === 1) ? '' : this.round(this.baroreflexFactor) + 'x - ' + this.baroreflexFactorExplanation,
            diseaseFactors: diseaseFactorText
        }
    }

    private round(val: number) {
        return Math.round(val*100)/100;
    }
}