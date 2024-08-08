import {Heart} from './Heart.js';
import {Graph} from './Graph.js';
import {Patient} from './Patient.js'

//console.log(math.solveODE());

//math.sqrt(5);

const canvas = <HTMLCanvasElement>document.getElementById("patient1Canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

var graph = new Graph(ctx, 60, 10, ctx.canvas.width/2 - 60, 200, 20);
var graph2 = new Graph(ctx, 60, 310, ctx.canvas.width/2 - 60, 200, 20);

var p = new Patient();
p.computeSteadyState();
var pressures = p.getAorticPressureSequence();
let flows = p.getAorticValveFlowSequence();
console.log(p.getPressureString());
console.log(p.getMAP());

var time = 0;
setInterval(function(){
    if (time < 20) {
        let [t, p] = pressures.getNextValue();
        while (t < time) {
            graph.addValue(t, p);
            pressures.popNextValue();
            let [t1, q] = flows.popNextValue();
            graph2.addValue(t1, q);
            [t, p] = pressures.getNextValue();
        }
        time += 0.05;
        graph.drawValues();
        graph2.drawValues();
    }
}, 50);



