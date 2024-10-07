/**
 * Stores output value and packages it into an OutputSummary
 */
export class Output {
    constructor(name, desc, unit) {
        this.formattedName = name;
        this.description = desc;
        this.unit = unit;
    }
    /**
     * Set numerical output value
     * @param val output value
     */
    setValue(val) {
        this.value = val;
    }
    /**
     * Get numerical output value
     * @returns output value
     */
    getValue() {
        return this.value;
    }
    /**
     * Get OutputSummary object for this output
     * @returns
     */
    getSummary() {
        return {
            value: isNaN(this.value) ? 'null' : this.value.toPrecision(3) + ' ' + this.unit,
            name: this.formattedName,
            description: this.description
        };
    }
}
