import { NumericalMethods } from './NumericalMethods.js'

export class Vasculature {

    private C_a: number; // mL / mmHg
    private R_a: number; // mmHg s / mL
    private R_p: number; // mmHg s / mL
    private msfp = 7;

    private flowFunc: (t:number)=>number;

    constructor() {
        this.setR_pFactor(1);
        this.setR_aFactor(1);
        this.setC_aFactor(1);
    }

    private dp_dt(t, p) {
        let Q = this.flowFunc;
        let C = this.C_a;
        let R_p = this.R_p;
        let R_a = this.R_a;
        return Q(t)/C*(1+R_a/R_p) + R_a*NumericalMethods.d_dt(Q, t) - p/(R_p*C) + this.msfp/(R_p*C);
    }

    evaluateAorticPressureSequence(flowFunc: (t:number)=>number, timespan, timestep) {
        this.flowFunc = flowFunc;
        let f = this.dp_dt.bind(this);
        let [ts, ps] = NumericalMethods.RungeKutta4(f, timespan, timestep, 80);
        return [ts, ps];
    }

    setR_pFactor(f: number) {
        this.R_p = 1 * f;
    }

    setR_aFactor(f: number) {
        this.R_a = 0.03 * f;
    }

    setC_aFactor(f: number) {
        this.C_a = 2 * f;
    }

    getR_p() {
        return this.R_p;
    }

    getR_a() {
        return this.R_a;
    }

    getC_a() {
        return this.C_a;
    }

}