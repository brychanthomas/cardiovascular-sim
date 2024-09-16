import { PARAM } from './CirculatoryParameters.js';

export abstract class Disease {

    protected parameterFactors: { [id in PARAM]? : number; };

    getFactors() {
        return this.parameterFactors;
    }

    abstract getName(): string;

}