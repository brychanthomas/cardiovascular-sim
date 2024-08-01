export class Graph {

    private context: CanvasRenderingContext2D;
    private basex: number;
    private basey: number;
    private width: number;
    private height: number;
    private timespan: number;
    private minval: number;
    private maxval: number;
    private ts: number[];
    private vs: number[];

    constructor(ctx, basex, basey, width, height, timespan) {
        this.context = ctx;
        this.basex = basex;
        this.basey = basey;
        this.width = width;
        this.height = height;
        this.timespan = timespan;
        this.minval = null;
        this.maxval = null;
        this.ts = [];
        this.vs = [];

        this.drawLabels();
        this.drawAxes();
    }
    /**
     * Draw a line from (x0, y0) to (x1, y1)
     * @param x0 
     * @param y0 
     * @param x1 
     * @param y1 
     */
    private line(x0: number, y0: number, x1: number, y1: number) {
        this.context.beginPath();
        this.context.moveTo(x0, y0);
        this.context.lineTo(x1, y1);
        this.context.stroke();
    }

    private timetox(t: number): number {
        var maxt = this.ts[this.ts.length-1];
        return this.basex+1+(this.width-1)*(t-maxt+this.timespan)/this.timespan;
    }

    private valtoy(v: number): number {
        var maxv = this.maxval;
        var minv = this.minval;
        let y = this.basey+this.height-(this.height)*(v-minv)/(maxv-minv)
        if (y < this.basey || y > this.basey+this.height) {
            return this.basey;
        }
        return y;
    }

    drawAxes() {
        this.context.strokeStyle = "white";
        this.line(this.basex, this.basey, this.basex, this.basey+this.height);
        if (this.minval <= 0) {
            let zeroy = this.valtoy(0);
            this.line(this.basex, zeroy, this.basex+this.width, zeroy);
        }
    }

    drawLabels() {
        this.context.font = "13px Arial";
        this.context.fillStyle = "white";
        this.context.strokeStyle = "white";

        this.context.clearRect(this.basex-30, this.basey-15, 30, this.height+30);
        this.context.clearRect(this.basex-20, this.basey+this.height, this.width+35, 30);

        let xOffset = String(this.maxval).length*7 + 8;
        this.line(this.basex, this.valtoy(this.maxval), this.basex-5, this.valtoy(this.maxval));
        this.context.fillText(String(this.maxval), this.basex-xOffset, this.valtoy(this.maxval)+5);
        if (this.minval != 0) {
            let xOffset = String(this.minval).length*7 + 8;
            this.line(this.basex, this.valtoy(this.minval), this.basex-5, this.valtoy(this.minval));
            this.context.fillText(String(this.minval), this.basex-xOffset, this.valtoy(this.minval)+5);
        }
        if (this.minval <= 0) {
            this.line(this.basex, this.valtoy(0), this.basex-5, this.valtoy(0));
            this.context.fillText("0", this.basex-15, this.valtoy(0)+5);
        }

        for (let i = 0; i<=this.timespan; i++) {
            this.context.beginPath();
            this.context.moveTo(this.basex+i*this.width/this.timespan, this.basey+this.height);
            this.context.lineTo(this.basex+i*this.width/this.timespan, this.basey+this.height+5);
            this.context.stroke();
            let xOffset = String(i-this.timespan).length * 4
            this.context.fillText(String(i-this.timespan), this.basex+i*this.width/this.timespan-xOffset, this.basey+this.height+20);
        }
    }

    addValue(t, v) {
        this.ts.push(t);
        this.vs.push(v);
        if (v>this.maxval || this.maxval === null) {
            this.maxval = Math.ceil(v/10)*10;
            this.drawLabels();
        } else if (v<this.minval || this.minval === null) {
            this.minval = Math.floor(v/10)*10;
            this.drawLabels();
        }
        while (this.ts[0] < t-this.timespan) {
            this.ts.splice(0, 1);
            this.vs.splice(0, 1);
        }
    }

    drawValues() {
        this.context.clearRect(this.basex, this.basey-1, this.width+1, this.height+2)
        this.drawAxes();

        this.context.strokeStyle = "#99ff99";
        this.context.beginPath();
        this.context.moveTo(this.timetox(this.ts[0]), this.valtoy(this.vs[0]));
        for (let i=1; i<this.ts.length; i++) {
            this.context.lineTo(this.timetox(this.ts[i]), this.valtoy(this.vs[i]));
        }
        this.context.stroke();
    }

}