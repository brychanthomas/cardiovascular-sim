import { OUT } from './CirculatoryOutputs.js';
import { PARAM } from './CirculatoryParameters.js';
import { ParameterValues, OutputValues } from './CirculatorySystem.js';


export class ClinicalSigns {

    static getSigns(paramsrest: ParameterValues, outsrest: OutputValues, paramsexer: ParameterValues, outsexer: OutputValues) {
        let signs: string[] = [];
        if (this.cyanosis(outsrest)) { signs.push(String(this.cyanosis(outsrest))) }
        if (this.oedema(outsrest)) { signs.push(String(this.oedema(outsrest))) }
        if (this.exerciseIntolerance(outsexer)) { signs.push(String(this.exerciseIntolerance(outsexer))) }
        if (this.increasedCRT(paramsrest)) { signs.push(String(this.increasedCRT(paramsrest))) }
        if (this.tachycardia(paramsrest)) { signs.push(String(this.tachycardia(paramsrest))) }
        if (this.bradycardia(paramsrest)) { signs.push(String(this.bradycardia(paramsrest))) }
        if (this.shock(outsrest)) { signs.push(String(this.shock(outsrest))) }
        return signs;
    }

    private static cyanosis(outsrest: OutputValues) {
        let co = outsrest[OUT.co];
        return (co < 4) ? "Cyanosis" : null;
    }

    private static oedema(outsrest: OutputValues) {
        let rap = outsrest[OUT.rap];
        return (rap > 7) ? "Peripheral oedema" : null;
    }

    private static exerciseIntolerance(outsexer: OutputValues) {
        let map = outsexer[OUT.map];
        return (map < 95) ? "Exercise intolerance" : null;
    }

    private static increasedCRT(paramsrest: ParameterValues) {
        let R_p = paramsrest[PARAM.R_p];
        return (R_p >= 1.2) ? "Increased capillary refill time" : null;
    }

    private static tachycardia(paramsrest: ParameterValues) {
        let rate = paramsrest[PARAM.rate];
        return (rate > 100) ? "Tachycardia" : null;
    }

    private static bradycardia(paramsrest: ParameterValues) {
        let rate = paramsrest[PARAM.rate];
        return (rate < 45) ? "Bradycardia" : null;
    }

    private static shock(outsrest: OutputValues) {
        let map = outsrest[OUT.map];
        return (map < 90) ? "Shock" : null;
    }
}