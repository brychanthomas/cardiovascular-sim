import { Heart } from './Heart.js';
import { Vasculature } from './Vasculature.js';
import { RepeatingTimeSequence } from './RepeatingTimeSequence.js';

export class CirculatorySystem {

    private heart: Heart = new Heart();
    private vasculature: Vasculature = new Vasculature();

    private aortatimeseq: number[];
    private aortapressureseq: number[];

    evaluatePressures() {
        let timespan = 10;
        let h = (60/this.heart.getRate())/100;
        let [ts, ps] = this.vasculature.evaluateAorticPressureSequence(this.heart.getFlow.bind(this.heart), timespan, h);
        let T = 60/this.heart.getRate();
        let samplesPerBeat = Math.floor(ps.length*T/timespan)
        ps = ps.slice(-samplesPerBeat);
        let minidx = ps.indexOf(Math.min(...ps));
        this.aortapressureseq = ps.slice(minidx).concat(ps.slice(0,minidx));
        this.aortatimeseq = ts.slice(0, samplesPerBeat);
    }

    getAorticPressureSequence() {
        return new RepeatingTimeSequence(this.aortatimeseq, this.aortapressureseq);
    }

    getAorticValveFlowSequence() {
        let timeseq = [];
        let flowseq = [];
        let T = 60/this.heart.getRate()
        for (var i = 0; i<100; i++) {
            timeseq.push(i*T/100);
            flowseq.push(this.heart.getFlow(i*T/100));
        }
        return new RepeatingTimeSequence(timeseq, flowseq);
    }

    getPressureString() {
        let diastolic = Math.round(Math.min(...this.aortapressureseq));
        let systolic = Math.round(Math.max(...this.aortapressureseq));
        return systolic+'/'+diastolic;
    }

    getMAP() {
        return this.aortapressureseq.reduce((a, b) => a + b) / this.aortapressureseq.length;
    }

    setR_pFactor(f: number) {
        this.vasculature.setR_pFactor(f);
    }

    setR_aFactor(f: number) {
        this.vasculature.setR_aFactor(f);
    }

    setC_aFactor(f: number) {
        this.vasculature.setC_aFactor(f);
    }

    setStrokeVolumeFactor() {
        return 1;
    }

    setDicroticLengthFactor() {
        return 1;
    }

    setDicroticPeakFlowFactor() {
        return 1;
    }

    /** TODO */
    setStressedVolumeFactor() {}
}