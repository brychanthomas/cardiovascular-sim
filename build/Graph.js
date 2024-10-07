/**
 * Line graph showing real-time data drawn on canvas element
 */
export class Graph {
    /**
     * Construct Graph object
     * @param canvas canvas element to draw graph on
     * @param basex x coordinate of top left corner within canvas
     * @param basey y coordinate of top left corner within canvas
     * @param width width of graph in pixels
     * @param height height of graph in pixels
     * @param timespan span of data to show on graph (seconds)
     */
    constructor(canvas, basex, basey, width, height, timespan) {
        this.timespanOptions = [1, 3, 5, 10];
        this.minval = null;
        this.maxval = null;
        this.storets = [];
        this.storevs = [];
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
    /**
     * Set y axis label of graph
     * @param lbl y label
     */
    setYLabel(lbl) {
        this.ylabel = lbl;
    }
    /**
     * Draw a straight line from (x0, y0) to (x1, y1)
     * @param x0 x coordinate of start point
     * @param y0 y coordinate of start point
     * @param x1 x coordinate of end point
     * @param y1 y coordinate of end point
     */
    line(x0, y0, x1, y1) {
        this.context.beginPath();
        this.context.moveTo(x0, y0);
        this.context.lineTo(x1, y1);
        this.context.stroke();
    }
    /**
     * Convert time value of a point to x coordinate
     * @param t time
     * @returns x coordinate
     */
    timetox(t) {
        var maxt = this.ts[this.ts.length - 1];
        return this.basex + 1 + (this.width - 1) * (t - maxt + this.timespan) / this.timespan;
    }
    /**
     * Convert time value of a stored point (not live) to x coordinate
     * @param t
     * @returns
     */
    storedtimetox(t) {
        var maxt = this.storets[this.storets.length - 1];
        return this.basex + 1 + (this.width - 1) * (t - maxt + this.timespan) / this.timespan;
    }
    /**
     * Convert value of a point to y coordinate
     * @param v value
     * @returns y coordinate
     */
    valtoy(v) {
        var maxv = this.maxval;
        var minv = this.minval;
        let y = this.basey + this.height - (this.height) * (v - minv) / (maxv - minv);
        if (y < this.basey || y > this.basey + this.height) {
            return this.basey;
        }
        return y;
    }
    /**
     * Draw x and y axis of graph (x axis only if zero within range of graphed values)
     */
    drawAxes() {
        this.context.strokeStyle = "white";
        this.line(this.basex, this.basey, this.basex, this.basey + this.height);
        if (this.minval <= 0) {
            let zeroy = this.valtoy(0);
            this.line(this.basex, zeroy, this.basex + this.width, zeroy);
        }
    }
    /**
     * Draw ticks on x and y axes, plus y label if one has been set
     */
    drawTicksAndLabels() {
        this.context.clearRect(this.basex - 50, this.basey - 15, 50, this.height + 30);
        this.context.clearRect(this.basex - 20, this.basey + this.height, this.width + 35, 30);
        this.drawYTicks();
        this.drawXTicks();
        this.drawYLabel();
    }
    /**
     * Draw ticks along y axis: one at max value rounded up to nearest 10, one at
     * min value rounded down to nearest 10, one at zero if within range
     */
    drawYTicks() {
        this.context.font = "13px Arial";
        this.context.fillStyle = "white";
        this.context.strokeStyle = "white";
        this.context.textAlign = "right";
        this.line(this.basex, this.valtoy(this.maxval), this.basex - 5, this.valtoy(this.maxval));
        this.context.fillText(String(this.maxval), this.basex - 10, this.valtoy(this.maxval) + 5);
        if (this.minval != 0) {
            this.line(this.basex, this.valtoy(this.minval), this.basex - 5, this.valtoy(this.minval));
            this.context.fillText(String(this.minval), this.basex - 10, this.valtoy(this.minval) + 5);
        }
        if (this.minval <= 0) {
            this.line(this.basex, this.valtoy(0), this.basex - 5, this.valtoy(0));
            this.context.fillText("0", this.basex - 10, this.valtoy(0) + 5);
        }
    }
    /**
     * Draw ticks along x axis: one for each increment if timespan is odd,
     * one every 2 increments if even
     */
    drawXTicks() {
        this.context.textAlign = "center";
        var increment = (this.timespan % 2 === 0) ? 2 : 1;
        for (let i = 0; i <= this.timespan; i += increment) {
            this.context.beginPath();
            this.context.moveTo(this.basex + i * this.width / this.timespan, this.basey + this.height);
            this.context.lineTo(this.basex + i * this.width / this.timespan, this.basey + this.height + 5);
            this.context.stroke();
            this.context.fillText(String(i - this.timespan), this.basex + i * this.width / this.timespan, this.basey + this.height + 20);
        }
    }
    /**
     * Draw y label rotated 90 deg
     */
    drawYLabel() {
        if (this.ylabel) {
            this.context.font = "16px Arial";
            this.context.textAlign = "center";
            this.context.save();
            this.context.translate(this.basex - 35, this.basey + this.height / 2);
            this.context.rotate(-Math.PI / 2);
            this.context.fillText(this.ylabel, 0, 0);
            this.context.restore();
        }
    }
    /**
     * Add live value to be drawn on graph next time drawValues called
     * @param t time
     * @param v value
     */
    addValue(t, v) {
        this.ts.push(t);
        this.vs.push(v);
        if (v > this.maxval || this.maxval === null) {
            this.maxval = Math.ceil(v / 10) * 10;
            this.drawTicksAndLabels();
        }
        else if (v < this.minval || this.minval === null) {
            this.minval = Math.floor(v / 10) * 10;
            this.drawTicksAndLabels();
        }
        //if only 0s present, maxval should be set to 10
        if (this.maxval == 0 && this.vs.length > 10 && this.vs.every((x) => x == 0)) {
            this.maxval = 10;
            this.drawTicksAndLabels();
        }
        while (this.ts[0] < t - Math.max(...this.timespanOptions)) {
            this.ts.splice(0, 1);
            this.vs.splice(0, 1);
        }
    }
    /**
     * Clear graph and redraw live values plus stored values if present
     */
    drawValues() {
        this.context.clearRect(this.basex, this.basey - 1, this.width + 1, this.height + 2);
        this.drawAxes();
        this.context.lineWidth = 1;
        if (this.storevs.length > 0) {
            this.context.strokeStyle = "#ff9999";
            this.plotArrays(this.storets.map(this.storedtimetox.bind(this)), this.storevs.map(this.valtoy.bind(this)));
        }
        this.context.strokeStyle = "#99ff99";
        this.plotArrays(this.ts.map(this.timetox.bind(this)), this.vs.map(this.valtoy.bind(this)));
    }
    /**
     * Plot lines between collection of points
     * @param xs x coordinates of points
     * @param ys y coordinates of points
     */
    plotArrays(xs, ys) {
        this.context.beginPath();
        let startidx = 0;
        while (xs[startidx] <= this.basex) {
            startidx++;
        }
        this.context.moveTo(xs[startidx], ys[startidx]);
        for (let i = startidx + 1; i < xs.length; i++) {
            this.context.lineTo(xs[i], ys[i]);
        }
        this.context.stroke();
    }
    /**
     * Clear live values currently being displayed
     */
    clearValues() {
        this.minval = Math.floor(Math.min(...this.storevs) / 10) * 10;
        this.maxval = Math.ceil(Math.max(...this.storevs) / 10) * 10;
        this.ts = [];
        this.vs = [];
        this.drawTicksAndLabels();
    }
    /**
     * Store current live values
     */
    store() {
        this.storets = this.ts.slice();
        this.storevs = this.vs.slice();
    }
    /**
     * Clear stored values
     */
    clearStored() {
        this.storets = [];
        this.storevs = [];
        this.minval = Math.floor(Math.min(...this.vs) / 10) * 10;
        this.maxval = Math.ceil(Math.max(...this.vs) / 10) * 10;
        this.drawTicksAndLabels();
    }
    /**
     * Create dropdown for selecting time period of graph
     * @param canvas HTMLCanvasElement graph is drawn on
     */
    initTimePeriodSelect(canvas) {
        var div = canvas.parentElement;
        var canvasPos = canvas.getBoundingClientRect();
        var select = document.createElement("select");
        select.classList.add("timePeriodSelect");
        select.style.top = canvasPos.top + this.basey + this.height + 8 + 'px';
        select.style.left = canvasPos.left + this.basex - 10 + 'px';
        div.appendChild(select);
        for (var i = 0; i < this.timespanOptions.length; i++) {
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
    /**
     * Set width of graph in pixels
     * @param w width of graph
     */
    setWidth(w) {
        this.context.clearRect(this.basex - 50, this.basey - 15, this.width + 60, this.height + 30);
        this.width = w;
        this.drawTicksAndLabels();
        this.drawAxes();
        this.drawValues();
    }
}
