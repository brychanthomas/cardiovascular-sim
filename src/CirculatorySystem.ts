import { Heart } from './Heart.js';
import { Vasculature } from './Vasculature.js';

export class CirculatorySystem {

    private heart: Heart = new Heart();
    private vasculature: Vasculature = new Vasculature();

    private aortatimeseq: number[];
    private aortapressureseq: number[];

    evaluatePressures() {
        let timespan = 10;
        let [ts, ps] = this.vasculature.evaluateAorticPressureSequence(this.heart.getFlow.bind(this.heart), timespan);
        let T = 60/this.heart.getRate();
        let samplesPerBeat = Math.floor(ps.length*T/timespan)
        this.aortapressureseq = ps.slice(-samplesPerBeat);
        this.aortatimeseq = ts.slice(0, samplesPerBeat);
    }

    getAorticPressureSequence() {
        return [this.aortatimeseq, this.aortapressureseq];
    }

    getAorticValveFlowSequence() {
        let timeseq = [];
        let flowseq = [];
        let T = 60/this.heart.getRate()
        for (var t = 0; t<T; t+= 0.01) {
            timeseq.push(t);
            flowseq.push(this.heart.getFlow(t));
        }
        return [timeseq, flowseq];
    }

    getPressureString() {
        let diastolic = Math.round(Math.min(...this.aortapressureseq));
        let systolic = Math.round(Math.max(...this.aortapressureseq));
        return systolic+'/'+diastolic;
    }

    getMAP() {
        return this.aortapressureseq.reduce((a, b) => a + b) / this.aortapressureseq.length;
    }
}