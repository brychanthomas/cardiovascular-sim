import { Parameter } from './Parameter.js'

export interface ParameterSummary {
    name: string,
    description: string,
    base: string,
    value: string,
    exerciseFactor: string,
    baroreflexFactor: string,
    diseaseFactors: string[]
}

export class SummarisableParameter extends Parameter {

    private unit: string = '';
    private formattedName: string = '';
    private description: string = '';
    private exerciseFactorExplanation: string = '';
    private baroreflexFactorExplanation: string = '';
    private diseaseFactorExplanations: string[] = [];
    private diseaseAdditorExplanations: string[] = [];

    setUnit(unit: string) {
        this.unit = unit;
    }

    setFormattedName(name: string) {
        this.formattedName = name;
    }

    setDescription(desc: string) {
        this.description = desc;
    }

    setExerciseFactorExplanation(exp: string) {
        this.exerciseFactorExplanation = exp;
    }

    setBaroreflexFactorExplanation(exp: string) {
        this.baroreflexFactorExplanation = exp;
    }

    setDiseaseModifierExplanations(factorExps: string[], additorExps: string[]) {
        this.diseaseFactorExplanations = factorExps;
        this.diseaseAdditorExplanations = additorExps;
    }

    getSummary(): ParameterSummary {
        var diseaseModifiers = [];
        for (var i = 0; i<this.diseaseAdditorExplanations.length; i++) {
            diseaseModifiers.push('(+)'+this.round(this.diseaseAdditors[i])+'x - ' + this.diseaseAdditorExplanations[i]);
        }
        for (var i = 0; i<this.diseaseFactorExplanations.length; i++) {
            diseaseModifiers.push('(×)'+this.round(this.diseaseFactors[i]) + ' - ' + this.diseaseFactorExplanations[i]);
        }
        return {
            name: this.formattedName,
            description: this.description,
            base: this.baseValue.toPrecision(3) + ' ' + this.unit,
            value: this.getValue().toPrecision(3) + ' ' + this.unit,
            exerciseFactor: (this.round(this.exerciseFactor) === 1) ? '' : '(×)'+this.round(this.exerciseFactor) + ' - ' + this.exerciseFactorExplanation,
            baroreflexFactor: (this.round(this.baroreflexFactor) === 1) ? '' : '(×)'+this.round(this.baroreflexFactor) + ' - ' + this.baroreflexFactorExplanation,
            diseaseFactors: diseaseModifiers
        }
    }

    private round(val: number) {
        return Math.round(val*100)/100;
    }
}