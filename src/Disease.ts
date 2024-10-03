import { PARAM } from './CirculatoryParameters.js';

export abstract class Disease {

    protected parameterFactorChanges: { [id: number] : number };
    protected severity: number = 0;
    protected severityMax = 100; 
    protected severityUnit = '%';

    getFactors() {
        var factors: { [id: number] : number } = {};
        for (var id in this.parameterFactorChanges) {
            factors[id] = 1 + this.parameterFactorChanges[id]*this.severity;
        }
        return factors;
    }

    /**
     * Set disease severity
     * @param s the severity of the disease as a decimal from 0 to maxSeverity
     */
    setSeverity(s: number) {
        this.severity = s/this.severityMax; 
    }

    getSeverity() {
        return this.severity*this.severityMax;
    }

    getMaxSeverity() {
        return this.severityMax;
    }

    getSeverityUnit() {
        return this.severityUnit
    }

    abstract getName(): string;

}



export class Atherosclerosis extends Disease {
    parameterFactorChanges = {
        [PARAM.C_a]: -0.3,
        [PARAM.R_a]: +0.2,
        //[PARAM.R_p]: 1.2
    }

    getName() { return "Atherosclerosis" }
}

export class AorticRegurguitation extends Disease {
    parameterFactorChanges = {
        [PARAM.aorticBackflow]: +399
    }

    getName() { return "Aortic regurguitation" }
}

export class Hypovolaemia extends Disease {
    
    severityMax = 1000; 
    severityUnit = 'mL lost';
    parameterFactorChanges = {
        [PARAM.msfp]: -1,
        [PARAM.aorticBackflow]: -1
    }

    getName() { return "Hypovolaemia" }
}

export class Hypervolaemia extends Disease {
    
    severityMax = 1000; 
    severityUnit = 'mL gained';
    parameterFactorChanges = {
        [PARAM.msfp]: +1,
        [PARAM.aorticBackflow]: +1
    }

    getName() { return "Hypervolaemia" }
}

export class HeartFailure extends Disease {
    
    parameterFactorChanges = {
        [PARAM.maxStrokeVolume]: -0.8
    }

    getName() { return "Right sided heart failure" }
}