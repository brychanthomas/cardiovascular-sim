import { Output, OutputSummary } from './Output.js';

/** Mapping of readable output name to numerical ID (like an enum).
 * IDs start at 1000 to avoid confusion with parameter IDs
 */
export const OUT = {
    strokeVolume: 1000,
    rap: 1001,
    diastolicPressure: 1002,
    systolicPressure: 1003,
    map: 1004,
    co: 1005,
    pp: 1006
}

/** Mapping of output ID to unit */
const units = {
    [OUT.strokeVolume]: 'mL',
    [OUT.rap]: 'mmHg',
    [OUT.diastolicPressure]: 'mmHg',
    [OUT.systolicPressure]: 'mmHg',
    [OUT.map]: 'mmHg',
    [OUT.co]: 'L/min',
    [OUT.pp]: 'mmHg'
}

/** Mapping of output ID to HTML-formatted name */
const formattedNames = {
    [OUT.strokeVolume]: 'SV',
    [OUT.rap]: 'RAP',
    [OUT.diastolicPressure]: 'P<sub>dia</sub>',
    [OUT.systolicPressure]: 'P<sub>sys</sub>',
    [OUT.map]: 'MAP',
    [OUT.co]: 'CO',
    [OUT.pp]: 'PP'
}

/** Mapping of output ID to description */
const descriptions = {
    [OUT.strokeVolume]: 'Stroke volume',
    [OUT.rap]: 'Right atrial pressure',
    [OUT.diastolicPressure]: 'Minimum pressure in the aorta',
    [OUT.systolicPressure]: 'Maximum pressure in the aorta',
    [OUT.map]: 'Mean arterial pressure',
    [OUT.co]: 'Cardiac output',
    [OUT.pp]: 'Pulse pressure: P<sub>sys</sub> - P<sub>dia</sub>'
}

/**
 * Stores all Output objects needed to store output values from CirculatorySystem
 */
export class CirculatoryOutputs {

    private values: { [id: number]: Output } = {};

    constructor() {
        for (var val of Object.values(OUT)) {
            this.values[val] = new Output(formattedNames[val], descriptions[val], units[val])
        }
    }

    /**
     * Set value of specific output
     * @param id output ID
     * @param value value to set it to
     */
    setValue(id: number, value: number) {
        this.values[id].setValue(value);
    }

    /**
     * Get value of specific output
     * @param id output ID
     * @returns value of corresponding output
     */
    getValue(id: number) {
        return this.values[id].getValue();
    }

    /**
     * Get OutputSummary object for specific output
     * @param id output ID
     * @returns OutputSummary for corresponding output
     */
    getSummary(id: number): OutputSummary {
        return this.values[id].getSummary();
    }

    /**
     * Get OutputSummary object for every output
     * @returns object mapping output ID to OutputSummary for every output
     */
    getAllOutputSummaries() {
        var summaries: { [id: number]: OutputSummary } = {};
        var outId: any;
        for (outId of Object.values(OUT)) {
            summaries[outId] = this.getSummary(outId);
        }
        return summaries;
    }

}