import { OUT } from './CirculatoryOutputs.js';
import { PARAM } from './CirculatoryParameters.js';
export class ClinicalSigns {
    static getSigns(paramsrest, outsrest, paramsexer, outsexer) {
        let signs = [];
        if (this.cyanosis(outsrest)) {
            signs.push(String(this.cyanosis(outsrest)));
        }
        if (this.oedema(outsrest)) {
            signs.push(String(this.oedema(outsrest)));
        }
        if (this.exerciseIntolerance(outsexer)) {
            signs.push(String(this.exerciseIntolerance(outsexer)));
        }
        if (this.increasedCRT(paramsrest)) {
            signs.push(String(this.increasedCRT(paramsrest)));
        }
        if (this.tachycardia(paramsrest)) {
            signs.push(String(this.tachycardia(paramsrest)));
        }
        if (this.bradycardia(paramsrest)) {
            signs.push(String(this.bradycardia(paramsrest)));
        }
        if (this.shock(outsrest)) {
            signs.push(String(this.shock(outsrest)));
        }
        return signs;
    }
    static cyanosis(outsrest) {
        let co = outsrest[OUT.co];
        return (co < 4) ? "Cyanosis" : null;
    }
    static oedema(outsrest) {
        let rap = outsrest[OUT.rap];
        return (rap > 7) ? "Peripheral oedema" : null;
    }
    static exerciseIntolerance(outsexer) {
        let map = outsexer[OUT.map];
        return (map < 95) ? "Exercise intolerance" : null;
    }
    static increasedCRT(paramsrest) {
        let R_p = paramsrest[PARAM.R_p];
        return (R_p >= 1.2) ? "Increased capillary refill time" : null;
    }
    static tachycardia(paramsrest) {
        let rate = paramsrest[PARAM.rate];
        return (rate > 100) ? "Tachycardia" : null;
    }
    static bradycardia(paramsrest) {
        let rate = paramsrest[PARAM.rate];
        return (rate < 45) ? "Bradycardia" : null;
    }
    static shock(outsrest) {
        let map = outsrest[OUT.map];
        return (map < 90) ? "Shock" : null;
    }
}
