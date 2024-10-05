import { NumericalMethods } from './NumericalMethods.js'

/**
 * Represents human vasculature - calculates pressure timeseries using Windkessel
 * model from aortic valve flow and parameters
 */
export class Vasculature {

    private C_a: number; // mL / mmHg
    private R_a: number; // mmHg s / mL
    private R_p: number; // mmHg s / mL
    private msfp: number;

    private flowFunc: (t:number)=>number;

    constructor() {}

    /**
     * Calculate time derivative of aortic pressure at given time and pressure
     * point using modified Windkessel equations
     * @param t 
     * @param p 
     * @returns 
     */
    private dp_dt(t: number, p: number) {
        let Q = this.flowFunc;
        let C = this.C_a;
        let R_p = this.R_p;
        let R_a = this.R_a;
        return Q(t)/C*(1+R_a/R_p) + R_a*NumericalMethods.d_dt(Q, t) - p/(R_p*C) + this.msfp/(R_p*C);
    }

    /**
     * Calculate timeseries of aortic pressure using the Windkessel model and 
     * numerical integration. Requires a function to get aortic valve flow at
     * certain timepoint. Uses initial conditions t=0, p=80.
     * @param flowFunc function mapping time to aortic valve flow
     * @param timespan how many seconds to calculate pressure for
     * @param timestep time between samples
     * @returns [timepoints, corresponding pressures]
     */
    evaluateAorticPressureSequence(flowFunc: (t:number)=>number, timespan: number, timestep: number) {
        this.flowFunc = flowFunc;
        let f = this.dp_dt.bind(this);
        let [ts, ps] = NumericalMethods.RungeKutta4(f, timespan, timestep, 80);
        return [ts, ps];
    }

    /**
     * Set peripheral resistance
     * @param val peripheral resistance (mmHg s/mL)
     */
    setR_p(val: number) {
        this.R_p = val;
    }

    /**
     * Set proximal arterial resistance
     * @param val proximal arterial resistance (mmHg s/mL)
     */
    setR_a(val: number) {
        this.R_a = val;
    }

    /**
     * Set arterial compliance
     * @param val arterial compliance (mL/mmHg)
     */
    setC_a(val: number) {
        this.C_a = val;
    }

    /**
     * Set mean systemic filling pressure
     * @param val MSFP (mmHg)
     */
    setMSFP(val: number) {
        this.msfp = val;
    }

    /**
     * Get currently set peripheral resistance
     * @returns peripheral resistance (mmHg s/mL)
     */
    getR_p() {
        return this.R_p;
    }

    /**
     * Get currently set proximal arterial resistance
     * @returns peripheral resistance (mmHg s/mL)
     */
    getR_a() {
        return this.R_a;
    }

    /**
     * Get currently set arterial compliance
     * @returns arterial compliance (mL/mmHg)
     */
    getC_a() {
        return this.C_a;
    }

}