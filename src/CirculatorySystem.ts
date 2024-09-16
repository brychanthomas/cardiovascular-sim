import { Heart } from './Heart.js';
import { Vasculature } from './Vasculature.js';
import { RepeatingTimeSequence } from './RepeatingTimeSequence.js';
import { PARAM, CirculatoryParameters } from './CirculatoryParameters.js';

export class CirculatorySystem {

    private heart: Heart = new Heart();
    private vasculature: Vasculature = new Vasculature();

    private aortatimeseq: number[];
    private aortapressureseq: number[];

    private baroreflexSetPoint = 93;
    private parameters = new CirculatoryParameters();

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
        let count = 0;
        while(map < set_point-1 || map > set_point+1) {
            set_point = this.baroreflexSetPoint + 6*reflex_coeff;
            if (map < set_point-1) {
                if (reflex_coeff > 1) { break; }
                reflex_coeff += Math.min((set_point-map)*0.001, 0.1);
            } else if (map > set_point+1) {
                reflex_coeff -= Math.min((map-set_point)*0.001, 0.1);
            }
            //this.parameters.getParameter(PARAM.strokeVolume).setBaroreflexFactor(1 + 0.3*reflex_coeff);
            this.parameters.getParameter(PARAM.rate).setBaroreflexFactor(1 + 2.3*reflex_coeff);
            this.parameters.getParameter(PARAM.systoleLength).setBaroreflexFactor(1 - 0.33*reflex_coeff);
            this.parameters.getParameter(PARAM.R_p).setBaroreflexFactor(1 + 0.33*reflex_coeff); // 1 / 0.75(25% splanchnic flow) = 1.33
            this.parameters.getParameter(PARAM.msfp).setBaroreflexFactor(1 + 2*reflex_coeff);
            this.applyParameters(this.parameters);
            this.evaluatePressures();
            map = this.getMAP();
            count++;
            if (count > 200) {
                alert("Baroreflex failed");
                return;
            }
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

    getPP() {
        return Math.max(...this.aortapressureseq) - Math.min(...this.aortapressureseq);
    }

    applyParameters(pf: CirculatoryParameters) {
        this.vasculature.setR_p(pf.getValue(PARAM.R_p));
        this.vasculature.setR_a(pf.getValue(PARAM.R_a));
        this.vasculature.setC_a(pf.getValue(PARAM.C_a));
        this.heart.setParameters(pf);
        this.parameters = pf;
    }

    /**
     * Get raw values of all circulatory parameters
     * @returns object of raw parameter values
     */
    getParameterSummaries() {
        var summaries = {};
        var param: any;
        for (param in Object.values(PARAM)) {
            summaries[param] = this.parameters.getParameter(param).getSummary();
        }
        return summaries;
    }
}