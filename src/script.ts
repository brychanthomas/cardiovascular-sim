import {Heart} from './Heart.js';
import {Graph} from './Graph.js';
import {CirculatorySystem} from './CirculatorySystem.js'

//console.log(math.solveODE());

//math.sqrt(5);

const canvas = <HTMLCanvasElement>document.getElementById("patient1Canvas");
const ctx = canvas.getContext("2d");

var graph = new Graph(ctx, 50, 10, 500, 200, 5);

var h = new Heart();

var c = new CirculatorySystem();
var [ts, ps] = c.evaluatePressures();
console.log(c.getPressureString());
console.log(c.getMAP());

var i = 0;
setInterval(function(){
    graph.addValue(i/100, ps[i%ps.length]);
    graph.drawValues();
    i++;
}, 10);

