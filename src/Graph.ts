export class Graph {

    private context: CanvasRenderingContext2D;
    private basex: number;
    private basey: number;
    private width: number;
    private height: number;
    private timespan: number;
    private timespanOptions = [1,3,5,10];
    private minval: number;
    private maxval: number;
    private ts: number[];
    private vs: number[];
    private storets: number[] = [];
    private storevs: number[] = [];
    private ylabel: string;

    constructor(canvas: HTMLCanvasElement, basex, basey, width, height, timespan) {
        this.context = canvas.getContext("2d");
        this.basex = basex;
        this.basey = basey;
        this.width = width;
        this.height = height;
        this.timespan = timespan;
        this.clearValues();

        this.drawTicksAndLabels();
        this.drawAxes();
        this.initTimePeriodSelect(canvas);
    }

    setYLabel(lbl: string) {
        this.ylabel = lbl;
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

    private storedtimetox(t: number): number {
        var maxt = this.storets[this.storets.length-1];
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

    drawTicksAndLabels() {
        this.context.clearRect(this.basex-50, this.basey-15, 50, this.height+30);
        this.context.clearRect(this.basex-20, this.basey+this.height, this.width+35, 30);
        this.drawYLabel();
        this.drawYTicks();
        this.drawXTicks();
    }

    private drawYTicks() {
        this.context.font = "13px Arial";
        this.context.fillStyle = "white";
        this.context.strokeStyle = "white";
        this.context.textAlign = "right";

        this.line(this.basex, this.valtoy(this.maxval), this.basex-5, this.valtoy(this.maxval));
        this.context.fillText(String(this.maxval), this.basex-10, this.valtoy(this.maxval)+5);
        if (this.minval != 0) {
            this.line(this.basex, this.valtoy(this.minval), this.basex-5, this.valtoy(this.minval));
            this.context.fillText(String(this.minval), this.basex-10, this.valtoy(this.minval)+5);
        }
        if (this.minval <= 0) {
            this.line(this.basex, this.valtoy(0), this.basex-5, this.valtoy(0));
            this.context.fillText("0", this.basex-10, this.valtoy(0)+5);
        }
    }

    private drawXTicks() {
        this.context.textAlign = "center";
        var increment = (this.timespan % 2 === 0) ? 2 : 1;

        for (let i = 0; i<=this.timespan; i+=increment) {
            this.context.beginPath();
            this.context.moveTo(this.basex+i*this.width/this.timespan, this.basey+this.height);
            this.context.lineTo(this.basex+i*this.width/this.timespan, this.basey+this.height+5);
            this.context.stroke();
            this.context.fillText(String(i-this.timespan), this.basex+i*this.width/this.timespan, this.basey+this.height+20);
        }
    }

    private drawYLabel() {
        if (this.ylabel) {
            this.context.font = "16px Arial";
            this.context.textAlign = "center";
            this.context.save();
            this.context.translate(this.basex - 35, this.basey + this.height/2);
            this.context.rotate(-Math.PI/2);
            this.context.fillText(this.ylabel, 0, 0);
            this.context.restore();
        }
    }

    addValue(t, v) {
        this.ts.push(t);
        this.vs.push(v);
        if (v>this.maxval || this.maxval === null) {
            this.maxval = Math.ceil(v/10)*10;
            this.drawTicksAndLabels();
        } else if (v<this.minval || this.minval === null) {
            this.minval = Math.floor(v/10)*10;
            this.drawTicksAndLabels();
        }
        while (this.ts[0] < t-Math.max(...this.timespanOptions)) {
            this.ts.splice(0, 1);
            this.vs.splice(0, 1);
        }
    }

    drawValues() {
        this.context.clearRect(this.basex, this.basey-1, this.width+1, this.height+2)
        this.drawAxes();
        this.context.lineWidth = 1;

        if (this.storevs.length > 0) {
            this.context.strokeStyle = "#ff9999";
            this.plotArrays(this.storets.map(this.storedtimetox.bind(this)), this.storevs.map(this.valtoy.bind(this)));
        }

        this.context.strokeStyle = "#99ff99";
        this.plotArrays(this.ts.map(this.timetox.bind(this)), this.vs.map(this.valtoy.bind(this)));
    }

    private plotArrays(xs: number[], ys: number[]) {
        this.context.beginPath();
        let startidx = 0;
        while (xs[startidx] <= this.basex) {
            startidx++
        }
        this.context.moveTo(xs[startidx], ys[startidx]);
        for (let i=startidx+1; i<xs.length; i++) {
            this.context.lineTo(xs[i], ys[i]);
        }
        this.context.stroke();
    }

    clearValues() {
        this.minval = Math.min(...this.storevs);
        this.maxval = Math.max(...this.storevs);
        this.ts = [];
        this.vs = [];
    }

    store() {
        this.storets = this.ts.slice();
        this.storevs = this.vs.slice();
    }

    clearStored() {
        this.storets = [];
        this.storevs = [];
        this.maxval = Math.max(...this.vs);
        this.minval = Math.min(...this.vs);
    }

    private initTimePeriodSelect(canvas: HTMLElement) {
        var div = canvas.parentElement;
        var canvasPos = canvas.getBoundingClientRect();
        var select = document.createElement("select");
        select.classList.add("timePeriodSelect");
        select.style.top = canvasPos.top + this.basey + this.height + 8 + 'px';
        select.style.left = canvasPos.left + this.basex - 10 +'px';
        div.appendChild(select);
        for (var i = 0; i<this.timespanOptions.length; i++) {
            var option = document.createElement("option");
            option.text = -this.timespanOptions[i] + ' s';
            option.value = String(this.timespanOptions[i]);
            select.appendChild(option);
        }
        select.value = '5';
        select.onchange = function () {
            this.timespan = this.timespanOptions[select.selectedIndex];
            this.drawTicksAndLabels();
        }.bind(this);
    }

}