export class RepeatingTimeSequence {
    constructor(ts, vs) {
        this.idx = 0;
        this.loops = 0;
        this.ts = ts;
        this.vs = vs;
    }
    getNextValue() {
        if (this.idx >= this.ts.length) {
            this.idx = 0;
            this.loops++;
        }
        let t = this.ts[this.idx] + this.loops * (this.ts[this.ts.length - 1] + this.ts[1]);
        return [t, this.vs[this.idx]];
    }
    popNextValue() {
        let v = this.getNextValue();
        this.idx++;
        return v;
    }
}
