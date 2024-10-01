import { Heart } from './Heart.js';
import { Vasculature } from './Vasculature.js';
import { RepeatingTimeSequence } from './RepeatingTimeSequence.js';
import { PARAM, CirculatoryParameters } from './CirculatoryParameters.js';
import { OUT, CirculatoryOutputs } from './CirculatoryOutputs.js';

export class CirculatorySystem {

    private heart: Heart = new Heart();
    private vasculature: Vasculature = new Vasculature();

    private aortatimeseq: number[];
    private aortapressureseq: number[];

    private parameters = new CirculatoryParameters();
    private outputs = new CirculatoryOutputs();

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
        if (this.heart.getCardiacOutput() === 0) {
            this.aortapressureseq = this.aortapressureseq.map(() => 0);
        }
    }

    baroreflex() {
        this.evaluatePressures();
        var map = this.getMAP();
        var reflex_coeff = 0;
        var set_point = this.parameters.getValue(PARAM.baroreflexSetPoint);
        let count = 0;
        do {
            if (map < set_point-0.3) {
                reflex_coeff += Math.min(Math.pow(0.9, count), 0.2);
            } else if (map > set_point+0.3) {
                reflex_coeff -= Math.min(Math.pow(0.9, count), 0.2);
            }
            this.parameters.getParameter(PARAM.rate).setBaroreflexFactor(1 + 2.3*reflex_coeff);
            this.parameters.getParameter(PARAM.rate).setBaroreflexFactorExplanation("baroreflex: increased sympathetic and decreased vagal tone from the cardiovascular centre");
            this.parameters.getParameter(PARAM.systoleLength).setBaroreflexFactor(1 - 0.33*reflex_coeff);
            this.parameters.getParameter(PARAM.systoleLength).setBaroreflexFactorExplanation("baroreflex: myocardial β<sub>1</sub> adrenergic receptor activation increasing SERCA pump activity for faster relaxation");
            this.parameters.getParameter(PARAM.R_p).setBaroreflexFactor(1 + 0.33*reflex_coeff); // 1 / 0.75(25% splanchnic flow) = 1.33
            this.parameters.getParameter(PARAM.R_p).setBaroreflexFactorExplanation("baroreflex: splanchnic vasoconstriction via α<sub>1</sub> adrenergic receptors");
            this.parameters.getParameter(PARAM.msfp).setBaroreflexFactor(1 + 2*reflex_coeff);
            this.parameters.getParameter(PARAM.msfp).setBaroreflexFactorExplanation("baroreflex: venoconstriction");
            this.applyParameters(this.parameters);
            this.evaluatePressures();
            map = this.getMAP();
            count++;
            if (count > 100) {
                console.log("BAROREFLEX FAILED");
                console.log('reflex_coeff:',reflex_coeff);
                return;
            }
            reflex_coeff = Math.min(reflex_coeff, 1);
            reflex_coeff = Math.max(reflex_coeff, 0);
        } while (map < set_point-0.3 || map > set_point+0.3);
        console.log('reflex_coeff:',reflex_coeff);
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

    getDiastolicPressure() {
        return Math.min(...this.aortapressureseq);
    }

    getSystolicPressure() {
        return Math.max(...this.aortapressureseq);
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

    getParameterSummaries() {
        return this.parameters.getAllParameterSummaries();
    }

    updateOutputs() {
        this.outputs.setValue(OUT.co, this.heart.getCardiacOutput());
        this.outputs.setValue(OUT.map, this.getMAP());
        this.outputs.setValue(OUT.diastolicPressure, this.getDiastolicPressure());
        this.outputs.setValue(OUT.systolicPressure, this.getSystolicPressure());
        this.outputs.setValue(OUT.rap, this.heart.getRAP());
        this.outputs.setValue(OUT.strokeVolume, this.heart.getStrokeVolume());
        console.log(this.heart.getStrokeVolume());
        this.outputs.setValue(OUT.pp, this.getPP());
    }

    getOutputSummaries() {
        this.updateOutputs();
        return this.outputs.getAllOutputSummaries();
    }
}