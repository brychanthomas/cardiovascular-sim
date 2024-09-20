import { Disease, Atherosclerosis, AorticRegurguitation } from './Disease.js';

export class Diseases {

    private static diseases: { [id: string]: Disease } = {
        'Atherosclerosis': new Atherosclerosis(),
        'Aortic regurguitation': new AorticRegurguitation()
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
}