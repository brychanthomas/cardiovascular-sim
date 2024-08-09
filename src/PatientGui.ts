import { Graph } from './Graph.js';
import { RepeatingTimeSequence } from './RepeatingTimeSequence.js';
import type { ParameterValues } from './Patient.js';

interface HTMLElementStore {
    [key: string]: HTMLElement;
 }

export class PatientGui {

    private pressureGraph: Graph;
    private flowGraph: Graph;
    private intervalId: number = -1;
    private time = 0;
    private parameterLabels: HTMLElementStore = {};

    constructor(patientRerunCallback:(e:number)=>void) {
        var wrapper = document.createElement("div");
        document.body.appendChild(wrapper);

        this.initCanvas(wrapper);

        var rightDiv = document.createElement("div");
        rightDiv.classList.add("leftFloat");
        wrapper.appendChild(rightDiv);

        this.initExerciseSlider(rightDiv, patientRerunCallback);
        this.initParameterText(rightDiv);
    }

    private initCanvas(parent: HTMLElement) {
        var canvas = document.createElement("canvas");
        canvas.classList.add("leftFloat");
        parent.appendChild(canvas);
        
        var ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
        ctx.canvas.width  = window.innerWidth/2;
        ctx.canvas.height = window.innerHeight;

        this.pressureGraph = new Graph(ctx, 60, 10, ctx.canvas.width - 100, 200, 5);
        this.flowGraph = new Graph(ctx, 60, 310, ctx.canvas.width - 100, 200, 5);
    }

    private initExerciseSlider(parent: HTMLElement, patientRerunCallback:(e:number)=>void) {
        this.createSpan("Exercise intensity: ", parent);
        var slider = document.createElement("input");
        slider.setAttribute("max", "100");
        slider.setAttribute("min", "0");
        slider.setAttribute("type", "range");
        slider.setAttribute("value", "0");
        parent.appendChild(slider);
        var sliderLabel = this.createSpan('0%', parent);
        slider.addEventListener("input", function() {
            sliderLabel.textContent = slider.value + '%';
        });
        slider.addEventListener("change", function() {
            patientRerunCallback(Number(slider.value)/100);
        });
        parent.appendChild(document.createElement('br'));
    }

    private initParameterText(parent: HTMLElement) {
        parent.appendChild(document.createElement('br'));
        this.parameterLabels['pressureString'] = this.createSpan("", parent);
        parent.appendChild(document.createElement('br'));
        this.parameterLabels['map'] = this.createSpan("", parent);
        parent.appendChild(document.createElement('br'));
        this.parameterLabels['pp'] = this.createSpan("", parent);
        parent.appendChild(document.createElement('br'));
        parent.appendChild(document.createElement('br'));
        this.parameterLabels['R_p'] = this.createSpan("", parent);;
        parent.appendChild(document.createElement('br'));
        this.parameterLabels['R_a'] = this.createSpan("", parent);;
        parent.appendChild(document.createElement('br'));
        this.parameterLabels['C_a'] = this.createSpan("", parent);
        parent.appendChild(document.createElement('br'));
        this.parameterLabels['rate'] = this.createSpan("", parent);
        parent.appendChild(document.createElement('br'));
    }

    private createSpan(text: string, parent: HTMLElement) {
        var span = document.createElement("span");
        span.textContent = text;
        parent.appendChild(span);
        return span;
    }

    setParameters(parameters: ParameterValues) {
        let formatted = {
            R_p: 'R<sub>p</sub>',
            R_a: 'R<sub>a</sub>',
            C_a: 'C<sub>a</sub>',
            rate: 'Heart rate',
            map: 'MAP',
            pp: 'Pulse pressure'
        }
        let decimalPoints = {
            R_p: 3,
            R_a: 3,
            C_a: 3,
            rate: 1,
            map: 1,
            pp: 1
        }
        for (var param in parameters) {
            if (param === 'pressureString') {
                this.parameterLabels[param].innerHTML = parameters[param];
                break;
            }
            this.parameterLabels[param].innerHTML = formatted[param] + ': ' + 
                Math.round(parameters[param].value*10**decimalPoints[param])/10**decimalPoints[param] + 
                ' ' + parameters[param].unit;
        }
    }

    setGraphSequences(pressures: RepeatingTimeSequence, flows: RepeatingTimeSequence) {
        if (this.intervalId != -1) {
            clearInterval(this.intervalId);
        }
        this.pressureGraph.clearValues();
        this.flowGraph.clearValues();
        this.time = 0;
        this.intervalId = setInterval(function(){
            if (this.time < 5) {
                let [t, p] = pressures.getNextValue();
                while (t < this.time) {
                    this.pressureGraph.addValue(t, p);
                    pressures.popNextValue();
                    let [t1, q] = flows.popNextValue();
                    this.flowGraph.addValue(t1, q);
                    [t, p] = pressures.getNextValue();
                }
                this.time += 0.050;
                this.pressureGraph.drawValues();
                this.flowGraph.drawValues();
            }
        }.bind(this), 50);
    }

}