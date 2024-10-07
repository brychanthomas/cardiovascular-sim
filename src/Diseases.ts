import { Disease, Atherosclerosis, AorticRegurgitation, Hypovolaemia, Hypervolaemia, HeartFailure, Bradycardia, Tachycardia } from './Disease.js';

export class DiseaseStore {

    private static diseases: { [id: string]: Disease } = {};
    
    static {
        let ds: Disease[] = [
            new Atherosclerosis(), new AorticRegurgitation(),
            new Hypovolaemia(), new Hypervolaemia(),
            new HeartFailure(), new Bradycardia(),
            new Tachycardia()
        ];
        for (var d of ds) {
            this.diseases[d.getName()] = d;
        }
    }

    static getAllDiseaseNames() {
        return Object.keys(this.diseases);
    }

    static getDiseaseFromName(name: string) {
        return this.diseases[name];
    }

    static getDiseaseListFromNameList(names: string[]) {
        var diseases: Disease[] = [];
        for (var name of names) {
            diseases.push(this.getDiseaseFromName(name));
        }
        return diseases;
    }

    static setSeverityByName(name: string, severity: number) {
        this.getDiseaseFromName(name).setSeverity(severity);
    }
}