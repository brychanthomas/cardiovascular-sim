import {Heart} from './Heart.js';
import {Graph} from './Graph.js';
import {CirculatorySystem} from './CirculatorySystem.js'

//console.log(math.solveODE());

//math.sqrt(5);

const canvas = <HTMLCanvasElement>document.getElementById("patient1Canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

var graph = new Graph(ctx, 30, 10, ctx.canvas.width/2 - 60, 200, 5);
var graph2 = new Graph(ctx, 30, 310, ctx.canvas.width/2 - 60, 200, 5);

var c = new CirculatorySystem();
c.evaluatePressures();
var pressures = c.getAorticPressureSequence();
let flows = c.getAorticValveFlowSequence();
console.log(c.getPressureString());
console.log(c.getMAP());

var time = 0;
setInterval(function(){
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
}, 50);



