export class Heart {

    private rate = 55;
    private strokeVolume = 90;
    private systoleLength = 0.3;
    private dicroticPeakFlow = 100;
    private dicroticLength = 0.05;

    constructor() {}

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
}