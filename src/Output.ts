/**
 * Object containing name, description and string value (rounded number and unit)
 * for an output.
 */
export interface OutputSummary {
    name: string,
    description: string,
    value: string
}

/**
 * Stores output value and packages it into an OutputSummary 
 */
export class Output {

    private value: number;
    private formattedName: string;
    private description: string;
    private unit: string;

    constructor(name: string, desc: string, unit: string) {
        this.formattedName = name;
        this.description = desc;
        this.unit = unit;
    }

    /**
     * Set numerical output value
     * @param val output value
     */
    setValue(val: number) {
        this.value = val;
    }

    /**
     * Get numerical output value
     * @returns output value
     */
    getValue(): number {
        return this.value;
    }

    /**
     * Get OutputSummary object for this output
     * @returns 
     */
    getSummary(): OutputSummary {
        return {
            value: isNaN(this.value) ? 'null' : this.value.toPrecision(3) + ' ' + this.unit,
            name: this.formattedName,
            description: this.description
        }
    }
}