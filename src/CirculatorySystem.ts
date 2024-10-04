import { Heart } from './Heart.js';
import { Vasculature } from './Vasculature.js';
import { RepeatingTimeSequence } from './RepeatingTimeSequence.js';
import { PARAM, CirculatoryParameters } from './CirculatoryParameters.js';
import { OUT, CirculatoryOutputs } from './CirculatoryOutputs.js';
import { Disease } from './Disease.js'

export interface OutputValues {
    [id: number]: number
}

export interface ParameterValues {
    [id: number]: number
}

export class CirculatorySystem {

    private heart: Heart = new Heart();
    private vasculature: Vasculature = new Vasculature();

    private aortatimeseq: number[];
    private aortapressureseq: number[];

    private parameters = new CirculatoryParameters();
    private outputs = new CirculatoryOutputs();

    setExerciseFactor(exerciseFactor: number) {
        this.parameters.getParameter(PARAM.R_p).setExerciseFactor(1 - 0.81*exerciseFactor); // TPR drops to 25% = 0.19(vasodilation)*1.33(splanchnic vasoconstriction)
        this.parameters.getParameter(PARAM.R_p).setExerciseFactorExplanation("exercise: vasodilation of arteries supplying exercising muscles (functional hyperaemia)");
        this.parameters.getParameter(PARAM.rvr).setExerciseFactor(1 - 0.3*exerciseFactor);
        this.parameters.getParameter(PARAM.rvr).setExerciseFactorExplanation("exercise: muscle pump effect due to movement of muscles near veins");
        this.parameters.getParameter(PARAM.baroreflexSetPoint).setExerciseFactor(1 + (4/93)*exerciseFactor);
        this.parameters.getParameter(PARAM.baroreflexSetPoint).setExerciseFactorExplanation("exercise: resetting of baroreceptors, possibly due to competition for input to NTS from joint and position sensors");
        this.applyParameters();
    }

    applyDiseases(ds: Disease[]) {
        this.parameters.applyDiseases(ds);
        this.applyParameters();
    }

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
        const tolerance = 0.1;
        var reflex_coeff = 0;
        var set_point = this.parameters.getValue(PARAM.baroreflexSetPoint);
        let count = 0;
        let p = this.parameters;
        do {
            if (map < set_point-tolerance) {
                reflex_coeff += Math.min(Math.pow(0.9, count), 0.2);
            } else if (map > set_point+tolerance) {
                reflex_coeff -= Math.min(Math.pow(0.9, count), 0.2);
            }
            reflex_coeff = Math.min(reflex_coeff, 1);
            let bounded_reflex_coeff = Math.max(reflex_coeff, 0);
            p.getParameter(PARAM.systoleLength).setBaroreflexFactor(1 - 0.33*bounded_reflex_coeff);
            p.getParameter(PARAM.systoleLength).setBaroreflexFactorExplanation("baroreflex: myocardial β<sub>1</sub> adrenergic receptor activation increasing SERCA pump activity for faster relaxation");
            p.getParameter(PARAM.R_p).setBaroreflexFactor(1 + 0.33*bounded_reflex_coeff); // 1 / 0.75(25% splanchnic flow) = 1.33
            p.getParameter(PARAM.R_p).setBaroreflexFactorExplanation("baroreflex: splanchnic vasoconstriction via α<sub>1</sub> adrenergic receptors");
            p.getParameter(PARAM.msfp).setBaroreflexFactor(1 + 2*bounded_reflex_coeff);
            p.getParameter(PARAM.msfp).setBaroreflexFactorExplanation("baroreflex: venoconstriction");
            let maxHeartRate = 60/(p.getParameter(PARAM.systoleLength).getValue()+p.getParameter(PARAM.dicroticLength).getValue()*2);
            p.getParameter(PARAM.rate).setBaroreflexFactor(1);
            let maxRateFactor = maxHeartRate/p.getParameter(PARAM.rate).getValue();
            p.getParameter(PARAM.rate).setBaroreflexFactor(1 + (maxRateFactor-1)*reflex_coeff);
            p.getParameter(PARAM.rate).setBaroreflexFactorExplanation("baroreflex: increased sympathetic and decreased vagal tone from the cardiovascular centre");
            this.applyParameters();
            this.evaluatePressures();
            map = this.getMAP();
            count++;
            if (count > 250) {
                console.log("BAROREFLEX FAILED");
                console.log('reflex_coeff:',reflex_coeff);
                return;
            }
        } while (map < set_point-tolerance || map > set_point+tolerance);
        console.log('reflex_coeff:',reflex_coeff);
        this.updateOutputs();
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

    private applyParameters() {
        this.vasculature.setR_p(this.parameters.getValue(PARAM.R_p));
        this.vasculature.setR_a(this.parameters.getValue(PARAM.R_a));
        this.vasculature.setC_a(this.parameters.getValue(PARAM.C_a));
        this.heart.setParameters(this.parameters);
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
        this.outputs.setValue(OUT.pp, this.getPP());
    }

    getOutputSummaries() {
        this.updateOutputs();
        return this.outputs.getAllOutputSummaries();
    }

    getOutputValues(): OutputValues {
        this.updateOutputs();
        var values: {[id: number]: number} = {};
        var id: any;
        for (id of Object.values(OUT)) {
            values[id] = this.outputs.getValue(id);
        }
        return values;
    }

    getParameterValues(): ParameterValues {
        var values: {[id: number]: number} = {};
        var id: any;
        for (id of Object.values(PARAM)) {
            values[id] = this.parameters.getValue(id);
        }
        return values;
    }
}