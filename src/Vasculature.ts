import { NumericalMethods } from './NumericalMethods.js'

export class Vasculature {

    private C_a = 2;
    private R_a = 0.03;
    private R_p = 1;
    private msfp = 7;

    private flowFunc: (t:number)=>number;

    private d_dt(func:(t: number)=>number, t: number) {
        let epsilon = 1e-6;
        let delta = func(t+epsilon)-func(t-epsilon);
        return delta / (2*epsilon);
    }

    private dp_dt(t, p) {
        let Q = this.flowFunc;
        let C = this.C_a;
        let R_p = this.R_p;
        let R_a = this.R_a;
        return Q(t)/C*(1+R_a/R_p) + R_a*this.d_dt(Q, t) - p/(R_p*C) + this.msfp/(R_p*C);
    }

    evaluateAorticPressureSequence(flowFunc: (t:number)=>number, timespan, timestep) {
        this.flowFunc = flowFunc;
        let f = this.dp_dt.bind(this);
        let [ts, ps] = NumericalMethods.RungeKutta4(f, timespan, timestep, 80);
        return [ts, ps];
    }

}