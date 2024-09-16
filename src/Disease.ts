import { PARAM } from './CirculatoryParameters.js';

export abstract class Disease {

    protected parameterFactors: { [id: number] : number };

    getFactors() {
        return this.parameterFactors;
    }

    abstract getName(): string;

}