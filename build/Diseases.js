var _a;
import { Atherosclerosis, AorticRegurgitation, Hypovolaemia, Hypervolaemia, HeartFailure, Bradycardia, Tachycardia } from './Disease.js';
export class DiseaseStore {
    static getAllDiseaseNames() {
        return Object.keys(this.diseases);
    }
    static getDiseaseFromName(name) {
        return this.diseases[name];
    }
    static getDiseaseListFromNameList(names) {
        var diseases = [];
        for (var name of names) {
            diseases.push(this.getDiseaseFromName(name));
        }
        return diseases;
    }
    static setSeverityByName(name, severity) {
        this.getDiseaseFromName(name).setSeverity(severity);
    }
}
_a = DiseaseStore;
DiseaseStore.diseases = {};
(() => {
    let ds = [
        new Atherosclerosis(), new AorticRegurgitation(),
        new Hypovolaemia(), new Hypervolaemia(),
        new HeartFailure(), new Bradycardia(),
        new Tachycardia()
    ];
    for (var d of ds) {
        _a.diseases[d.getName()] = d;
    }
})();
