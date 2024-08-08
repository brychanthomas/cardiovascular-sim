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

    applyDiseases(list: Disease[]) {
        for (var i=0; i<list.length; i++) {
            this.R_pBase *= list[i].getR_pFactor();
            this.R_aBase *= list[i].getR_aFactor();
            this.C_aBase *= list[i].getC_aFactor();
            this.strokeVolumeBase *= list[i].getStrokeVolumeFactor();
            this.dicroticLengthBase *= list[i].getDicroticLengthFactor();
            this.dicroticPeakFlowBase *= list[i].getDicroticPeakFlowFactor();
        }
    }

    setR_pFactor(f: number) {
        this.R_pFactor = this.R_pBase * f;
    }

    getR_pFactor() {
        return this.R_pFactor;
    }

    setR_aFactor(f: number) {
        this.R_aFactor = this.R_aBase * f;
    }

    getR_aFactor() {
        return this.R_aFactor;
    }

    setC_aFactor(f: number) {
        this.C_aFactor = this.C_aBase * f;
    }

    getC_aFactor() {
        return this.C_aFactor;
    }

    setRateFactor(f: number) {
        this.rateFactor = this.rateBase * f;
    }

    getRateFactor() {
        return this.rateFactor;
    }

    setStrokeVolumeFactor(f: number) {
        this.strokeVolumeFactor = this.strokeVolumeBase * f;
    }

    getStrokeVolumeFactor() {
        return this.strokeVolumeFactor;
    }

    setSystoleLengthFactor(f: number) {
        this.systoleLengthFactor = this.systoleLengthBase * f;
    }

    getSystoleLengthFactor() {
        return this.systoleLengthFactor;
    }

    setDicroticLengthFactor(f: number) {
        this.dicroticLengthFactor = this.dicroticLengthBase * f;
    }

    getDicroticLengthFactor() {
        return this.dicroticLengthFactor;
    }

    setDicroticPeakFlowFactor(f: number) {
        this.dicroticPeakFlowFactor = this.dicroticPeakFlowBase * f;
    }

    getDicroticPeakFlowFactor() {
        return this.dicroticPeakFlowFactor;
    }

}