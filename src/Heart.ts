import { NumericalMethods } from './NumericalMethods.js'

export class Heart {

    private rate: number; // bpm
    private strokeVolume: number; // mL
    private systoleLength: number; // s
    private dicroticPeakFlow: number; // mL/s
    private dicroticLength: number; // s

    constructor() {
        this.setRateFactor(1);
        this.setStrokeVolumeFactor(1);
        this.setSystoleLengthFactor(1);
        this.setDicroticLengthFactor(1);
        this.setDicroticPeakFlowFactor(1);
    }

    getFlow(t: number): number {
        let T = 60/this.rate;
        let peak_flow = (this.strokeVolume + 2*100*0.05/Math.PI) * Math.PI/(2*this.systoleLength);
        if (t%T < this.systoleLength) {
            return peak_flow*Math.sin(Math.PI * (t%T)/this.systoleLength);
        } else if (t%T < this.systoleLength + this.dicroticLength) {
            return -this.dicroticPeakFlow*Math.sin(Math.PI*(t%T-this.systoleLength)/this.dicroticLength);
        } else {
            return 0;
        }
    }

    getRate(): number {
        return this.rate;
    }

    getStrokeVolume(): number {
        return this.strokeVolume;
    }

    getCardiacOutput(): number {
        let f = this.getFlow.bind(this);
        let T = 60 / this.getRate();
        let sv = NumericalMethods.TrapezoidalIntegration(f, T, 100);
        return sv * this.getRate() / 1000;
    }

    setStrokeVolumeFactor(f: number) {
        this.strokeVolume = Math.min(95 * f, 125);
    }

    setDicroticLengthFactor(f: number) {
        this.dicroticLength = 0.05 * f;
    }

    setDicroticPeakFlowFactor(f: number) {
        this.dicroticPeakFlow = 100 * f;
    }

    setSystoleLengthFactor(f: number) {
        this.systoleLength = 0.3 * f;
    }

    setRateFactor(f: number) {
        this.rate = 53 * f;
    }
}