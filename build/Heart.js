import { PARAM } from "./CirculatoryParameters.js";
/**
 * Represents a human heart - calculates aortic valve flow timeseries and
 * CO, RAP and SV based on parameters
 */
export class Heart {
    constructor() { }
    /**
     * Get flow through aortic valve at certain timestep
     * @param t time in seconds
     * @returns flow through aortic valve (mL/s)
     */
    getFlow(t) {
        let T = 60 / this.rate;
        let peak_flow = (this.strokeVolume) * Math.PI / (2 * this.systoleLength);
        this.dicroticPeakFlow = peak_flow / 5; //estimation - should actually be proportional to MAP minus intra-ventricular pressure
        if (t % T < this.systoleLength) {
            return this.aorticBackflow + peak_flow * Math.sin(Math.PI * (t % T) / this.systoleLength);
        }
        else if (t % T < this.systoleLength + this.dicroticLength) {
            return this.aorticBackflow - this.dicroticPeakFlow * Math.sin(Math.PI * (t % T - this.systoleLength) / this.dicroticLength);
        }
        else {
            return this.aorticBackflow;
        }
    }
    /**
     * Get current heart rate (parameter)
     * @returns heart rate (BPM)
     */
    getRate() {
        return this.rate;
    }
    /**
     * Get current stroke volume (output - calculated from parameters)
     * @returns stroke volume (mL)
     */
    getStrokeVolume() {
        return this.strokeVolume;
    }
    /**
     * Get current cardiac output (output - calculated from parameters and SV)
     * @returns cardiac output (L/min)
     */
    getCardiacOutput() {
        //let f = this.getFlow.bind(this);
        //let T = 60 / this.getRate();
        //let sv = NumericalMethods.TrapezoidalIntegration(f, T, 100);
        let sv = this.strokeVolume - 2 * this.dicroticPeakFlow * this.dicroticLength / Math.PI;
        return (sv * this.getRate() + this.aorticBackflow * 60) / 1000;
    }
    /**
     * Set parameters relevant for heart (MSFP, RVR, rate, maxStrokeVolume,
     * dicroticLength, systoleLength, aorticBackflow)
     * @param params CirculatoryParameters object
     */
    setParameters(params) {
        this.strokeVolume = (params.getValue(PARAM.msfp) / params.getValue(PARAM.rvr)) / params.getValue(PARAM.rate);
        if (this.strokeVolume > params.getValue(PARAM.maxStrokeVolume)) {
            this.strokeVolume = params.getValue(PARAM.maxStrokeVolume);
            this.rap = this.strokeVolume * params.getValue(PARAM.rate) * params.getValue(PARAM.rvr);
            this.rap = -this.rap + params.getValue(PARAM.msfp);
        }
        else {
            this.rap = 0;
        }
        this.dicroticLength = params.getValue(PARAM.dicroticLength);
        this.systoleLength = params.getValue(PARAM.systoleLength);
        this.rate = params.getValue(PARAM.rate);
        this.aorticBackflow = params.getValue(PARAM.aorticBackflow);
    }
    /**
     * Get right atrial pressure (output - calculated from parameters)
     * @returns RAP (mmHg)
     */
    getRAP() {
        return this.rap;
    }
}
