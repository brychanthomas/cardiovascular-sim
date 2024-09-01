export class Heart {

    private rate: number; // bpm
    private strokeVolume: number; // mL
    private systoleLength: number; // s
    private dicroticPeakFlow: number; // mL/s
    private dicroticLength: number; // s
    private aorticBackflow: number; // mL/s

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

    setStrokeVolume(val: number) {
        this.strokeVolume = Math.min(val, 125);
    }

    setDicroticLength(val: number) {
        this.dicroticLength = val;
    }

    setDicroticPeakFlow(val: number) {
        this.dicroticPeakFlow = val;
    }

    setSystoleLength(val: number) {
        this.systoleLength = val;
    }

    setRate(val: number) {
        this.rate = val;
    }

    setAorticBackflow(val: number) {
        this.aorticBackflow = val;
    }
}