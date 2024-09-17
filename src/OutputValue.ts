export interface OutputValueSummary {
    name: string,
    description: string,
    value: string
}

export class OutputValue {

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

    getSummary (): OutputValueSummary {
        return {
            value: this.value.toPrecision(3) + ' ' + this.unit,
            name: this.formattedName,
            description: this.description
        }
    }
}