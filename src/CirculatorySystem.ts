import { Heart } from './Heart.js';
import { NumericalMethods } from './NumericalMethods.js'

export class CirculatorySystem {

    heart: Heart = new Heart();

    private C_a = 2;
    private R_a = 0.03;
    private R_p = 1;
    private msfp = 7;

    private timeseq;
    private pressureseq;

    private d_dt(func:(t: number)=>number, t: number) {
        let epsilon = 1e-6;
        let delta = func(t+epsilon)-func(t-epsilon);
        return delta / (2*epsilon);
    }

    private dp_dt(t, p) {
        let Q = this.heart.getFlow.bind(this.heart);
        let C = this.C_a;
        let R_p = this.R_p;
        let R_a = this.R_a;
        return Q(t)/C*(1+R_a/R_p) + R_a*this.d_dt(Q, t) - p/(R_p*C) + this.msfp/(R_p*C);
    }

    evaluatePressures() {
        let f = this.dp_dt.bind(this);
        let h = 0.01;
        let timespan = 10;
        let [ts, ps] = NumericalMethods.RungeKutta4(f, timespan, h, 80);
        let T = 60/this.heart.getRate();
        let samplesPerBeat = Math.floor(ps.length*T/timespan)
        this.pressureseq = ps.slice(-samplesPerBeat);
        this.timeseq = ts.slice(0, samplesPerBeat);
        return [this.timeseq, this.pressureseq];
    }

    getPressureString() {
        let diastolic = Math.round(Math.min(...this.pressureseq));
        let systolic = Math.round(Math.max(...this.pressureseq));
        return systolic+'/'+diastolic;
    }

    getMAP() {
        return this.pressureseq.reduce((a, b) => a + b) / this.pressureseq.length;
    }
}