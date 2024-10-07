import { PARAM } from './CirculatoryParameters.js';
export class Disease {
    constructor() {
        this.severity = 0;
        this.severityMax = 100;
        this.severityUnit = '%';
    }
    getFactors() {
        var factors = {};
        for (var id in this.parameterFactorChanges) {
            factors[id] = 1 + this.parameterFactorChanges[id] * this.severity;
        }
        return factors;
    }
    getAdditors() {
        var additors = {};
        for (var id in this.parameterAdditiveChanges) {
            additors[id] = this.parameterAdditiveChanges[id] * this.severity;
        }
        return additors;
    }
    /**
     * Set disease severity
     * @param s the severity of the disease as a decimal from 0 to maxSeverity
     */
    setSeverity(s) {
        this.severity = s / this.severityMax;
    }
    getSeverity() {
        return this.severity * this.severityMax;
    }
    getMaxSeverity() {
        return this.severityMax;
    }
    getSeverityUnit() {
        return this.severityUnit;
    }
}
export class Atherosclerosis extends Disease {
    constructor() {
        super(...arguments);
        this.parameterFactorChanges = {
            [PARAM.C_a]: -0.4,
            [PARAM.R_a]: +0.3,
            [PARAM.R_p]: +0.2,
            [PARAM.baroreflexSetPoint]: +0.2
        };
    }
    getName() { return "Atherosclerosis"; }
}
export class AorticRegurgitation extends Disease {
    constructor() {
        super(...arguments);
        this.parameterFactorChanges = {
            [PARAM.aorticBackflow]: +999
        };
    }
    getName() { return "Aortic regurgitation"; }
}
export class Hypovolaemia extends Disease {
    constructor() {
        super(...arguments);
        this.severityMax = 1000;
        this.severityUnit = 'mL lost';
        this.parameterAdditiveChanges = {
            [PARAM.msfp]: -1,
            [PARAM.aorticBackflow]: -1
        };
    }
    getName() { return "Hypovolaemia"; }
}
export class Hypervolaemia extends Disease {
    constructor() {
        super(...arguments);
        this.severityMax = 1000;
        this.severityUnit = 'mL gained';
        this.parameterAdditiveChanges = {
            [PARAM.msfp]: +1,
            [PARAM.aorticBackflow]: +1
        };
    }
    getName() { return "Hypervolaemia"; }
}
export class HeartFailure extends Disease {
    constructor() {
        super(...arguments);
        this.parameterFactorChanges = {
            [PARAM.maxStrokeVolume]: -0.8
        };
    }
    getName() { return "Right sided heart failure"; }
}
export class Bradycardia extends Disease {
    constructor() {
        super(...arguments);
        this.parameterFactorChanges = {
            [PARAM.rate]: -0.7
        };
    }
    getName() { return "Sinus bradycardia"; }
}
export class Tachycardia extends Disease {
    constructor() {
        super(...arguments);
        this.parameterFactorChanges = {
            [PARAM.rate]: +0.8
        };
    }
    getName() { return "Sinus tachycardia"; }
}
