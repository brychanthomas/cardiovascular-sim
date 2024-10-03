export interface OutputSummary {
    name: string,
    description: string,
    value: string
}

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

    setValue(val: number) {
        this.value = val;
    }

    getSummary(): OutputSummary {
        return {
            value: isNaN(this.value) ? 'null' : this.value.toPrecision(3) + ' ' + this.unit,
            name: this.formattedName,
            description: this.description
        }
    }

    getValue(): number {
        return this.value;
    }
}