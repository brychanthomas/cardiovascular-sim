import { CirculatoryParameters, PARAM } from "./CirculatoryParameters.js";

export class Heart {

    private rate: number; // bpm
    private strokeVolume: number; // mL
    private systoleLength: number; // s
    private dicroticPeakFlow: number; // mL/s
    private dicroticLength: number; // s
    private aorticBackflow: number; // mL/s
    private rap: number;

    constructor() {}

    getFlow(t: number): number {
        let T = 60/this.rate;
        let peak_flow = (this.strokeVolume) * Math.PI/(2*this.systoleLength);
        if (t%T < this.systoleLength) {
            return this.aorticBackflow+peak_flow*Math.sin(Math.PI * (t%T)/this.systoleLength);
        } else if (t%T < this.systoleLength + this.dicroticLength) {
            return this.aorticBackflow-this.dicroticPeakFlow*Math.sin(Math.PI*(t%T-this.systoleLength)/this.dicroticLength);
        } else {
            return this.aorticBackflow;
        }
    }

    getRate(): number {
        return this.rate;
    }

    getStrokeVolume(): number {
        return this.strokeVolume;
    }

    getCardiacOutput(): number {
        //let f = this.getFlow.bind(this);
        //let T = 60 / this.getRate();
        //let sv = NumericalMethods.TrapezoidalIntegration(f, T, 100);
        let sv = this.strokeVolume - 2*this.dicroticPeakFlow*this.dicroticLength/Math.PI;
        return (sv*this.getRate() + this.aorticBackflow*60) / 1000;
    }

    setParameters(params: CirculatoryParameters) {
        this.strokeVolume = (params.getValue(PARAM.msfp) / params.getValue(PARAM.rvr)) / params.getValue(PARAM.rate);
        if (this.strokeVolume > params.getValue(PARAM.maxStrokeVolume)) {
            this.strokeVolume = params.getValue(PARAM.maxStrokeVolume);
            this.rap = this.strokeVolume * params.getValue(PARAM.rate) * params.getValue(PARAM.rvr);
            this.rap = -this.rap + params.getValue(PARAM.msfp);
        } else { this.rap = 0 }
        this.dicroticLength = params.getValue(PARAM.dicroticLength);
        this.dicroticPeakFlow = params.getValue(PARAM.dicroticPeakFlow);
        this.systoleLength = params.getValue(PARAM.systoleLength);
        this.rate = params.getValue(PARAM.rate);
        this.aorticBackflow = params.getValue(PARAM.aorticBackflow);
    }

    getRap() {
        return this.rap;
    }
}