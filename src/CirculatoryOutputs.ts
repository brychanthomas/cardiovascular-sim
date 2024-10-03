import { Output, OutputSummary } from './Output.js';

export const OUT = {
    strokeVolume: 0,
    rap: 1,
    diastolicPressure: 2,
    systolicPressure: 3,
    map: 4,
    co: 5,
    pp: 6
}

const units = {
    [OUT.strokeVolume]: 'mL',
    [OUT.rap]: 'mmHg',
    [OUT.diastolicPressure]: 'mmHg',
    [OUT.systolicPressure]: 'mmHg',
    [OUT.map]: 'mmHg',
    [OUT.co]: 'L/min',
    [OUT.pp]: 'mmHg'
}

const formattedNames = {
    [OUT.strokeVolume]: 'SV',
    [OUT.rap]: 'RAP',
    [OUT.diastolicPressure]: 'P<sub>dia</sub>',
    [OUT.systolicPressure]: 'P<sub>sys</sub>',
    [OUT.map]: 'MAP',
    [OUT.co]: 'CO',
    [OUT.pp]: 'PP'
}

const descriptions = {
    [OUT.strokeVolume]: 'Stroke volume',
    [OUT.rap]: 'Right atrial pressure',
    [OUT.diastolicPressure]: 'Minimum pressure in the aorta',
    [OUT.systolicPressure]: 'Maximum pressure in the aorta',
    [OUT.map]: 'Mean arterial pressure',
    [OUT.co]: 'Cardiac output',
    [OUT.pp]: 'Pulse pressure: P<sub>sys</sub> - P<sub>dia</sub>'
}

export class CirculatoryOutputs {

    private values: { [id: number]: Output } = {};

    constructor() {
        for (var val of Object.values(OUT)) {
            this.values[val] = new Output(formattedNames[val], descriptions[val], units[val])
        }
    }

    setValue(id: number, value: number) {
        this.values[id].setValue(value);
    }

    getValue(id: number) {
        return this.values[id].getValue();
    }

    getSummary(id: number): OutputSummary {
        return this.values[id].getSummary();
    }

    getAllOutputSummaries() {
        var summaries: { [id: number]: OutputSummary } = {};
        var param: any;
        for (param in Object.values(OUT)) {
            summaries[param] = this.getSummary(param);
        }
        return summaries;
    }

}