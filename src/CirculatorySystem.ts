import { Heart } from './Heart.js';
import { Vasculature } from './Vasculature.js';
import { RepeatingTimeSequence } from './RepeatingTimeSequence.js';
import { CirculatoryParameterFactors } from './CirculatoryParameterFactors.js';

export class CirculatorySystem {

    private heart: Heart = new Heart();
    private vasculature: Vasculature = new Vasculature();

    private aortatimeseq: number[];
    private aortapressureseq: number[];

    private baroreflexSetPoint = 93;
    private parameterFactors = new CirculatoryParameterFactors();

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

    baroreflex() {
        this.evaluatePressures();
        var map = this.getMAP();
        var reflex_coeff = 0;
        var set_point = -1;
        while(map < set_point-1 || map > set_point+1) {
            set_point = this.baroreflexSetPoint + 15*reflex_coeff;
            if (map < set_point-1) {
                reflex_coeff += Math.min((set_point-map)*0.001, 0.1);
            } else if (map > set_point+1) {
                reflex_coeff -= Math.min((map-set_point)*0.001, 0.1);
            }
            this.parameterFactors.setStrokeVolumeFactor(1 + 0.3*reflex_coeff);
            this.parameterFactors.setRateFactor(1 + 2*reflex_coeff);
            this.parameterFactors.setSystoleLengthFactor(1 - 0.33*reflex_coeff);
            this.applyParameterFactors(this.parameterFactors);
            this.evaluatePressures();
            map = this.getMAP();
        }
        console.log(reflex_coeff);
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

    applyParameterFactors(pf: CirculatoryParameterFactors) {
        this.vasculature.setR_pFactor(pf.getR_pFactor());
        this.vasculature.setR_aFactor(pf.getR_aFactor());
        this.vasculature.setC_aFactor(pf.getC_aFactor());
        this.heart.setStrokeVolumeFactor(pf.getStrokeVolumeFactor());
        this.heart.setRateFactor(pf.getRateFactor());
        this.heart.setDicroticLengthFactor(pf.getDicroticLengthFactor());
        this.heart.setSystoleLengthFactor(pf.getSystoleLengthFactor());
        this.heart.setDicroticPeakFlowFactor(pf.getDicroticPeakFlowFactor());
        this.parameterFactors = pf;
    }
}