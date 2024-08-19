import { Disease } from './Disease.js';
import { CirculatorySystem } from './CirculatorySystem';

export class CirculatoryParameterFactors {
    private R_pBase = 1;
    private R_pFactor = 1;
    private R_aBase = 1;
    private R_aFactor = 1;
    private C_aBase = 1;
    private C_aFactor = 1;
    private rateBase = 1;
    private rateFactor = 1;
    private strokeVolumeBase = 1;
    private strokeVolumeFactor = 1;
    private systoleLengthBase = 1;
    private systoleLengthFactor = 1;
    private dicroticLengthBase = 1;
    private dicroticLengthFactor = 1;
    private dicroticPeakFlowBase = 1;
    private dicroticPeakFlowFactor = 1;
    private aorticBackflowBase = 1;
    private aorticBackflowFactor = 1;

    applyDiseases(list: Disease[]) {
        for (var i=0; i<list.length; i++) {
            this.R_pBase *= list[i].getR_pFactor();
            this.R_aBase *= list[i].getR_aFactor();
            this.C_aBase *= list[i].getC_aFactor();
            this.strokeVolumeBase *= list[i].getStrokeVolumeFactor();
            this.dicroticLengthBase *= list[i].getDicroticLengthFactor();
            this.dicroticPeakFlowBase *= list[i].getDicroticPeakFlowFactor();
            this.aorticBackflowBase *= list[i].getAorticBackflowFactor();
        }
    }

    setR_pFactor(f: number) {
        this.R_pFactor = f;
    }

    getR_pFactor() {
        return this.R_pBase * this.R_pFactor;
    }

    setR_aFactor(f: number) {
        this.R_aFactor = f;
    }

    getR_aFactor() {
        return this.R_aBase * this.R_aFactor;
    }

    setC_aFactor(f: number) {
        this.C_aFactor = f;
    }

    getC_aFactor() {
        return this.C_aBase * this.C_aFactor;
    }

    setRateFactor(f: number) {
        this.rateFactor = f;
    }

    getRateFactor() {
        return this.rateBase * this.rateFactor;
    }

    setStrokeVolumeFactor(f: number) {
        this.strokeVolumeFactor = f;
    }

    getStrokeVolumeFactor() {
        return this.strokeVolumeBase * this.strokeVolumeFactor;
    }

    setSystoleLengthFactor(f: number) {
        this.systoleLengthFactor = f;
    }

    getSystoleLengthFactor() {
        return this.systoleLengthBase * this.systoleLengthFactor;
    }

    setDicroticLengthFactor(f: number) {
        this.dicroticLengthFactor = f;
    }

    getDicroticLengthFactor() {
        return this.dicroticLengthBase * this.dicroticLengthFactor;
    }

    setDicroticPeakFlowFactor(f: number) {
        this.dicroticPeakFlowFactor = f;
    }

    getDicroticPeakFlowFactor() {
        return this.dicroticPeakFlowBase * this.dicroticPeakFlowFactor;
    }

    setAorticBackflowFactor(f: number) {
        this.aorticBackflowFactor = f;
    }

    getAorticBackflowFactor() {
        return this.aorticBackflowBase * this.aorticBackflowFactor;
    }

}