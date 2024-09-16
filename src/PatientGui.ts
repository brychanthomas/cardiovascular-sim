import { Graph } from './Graph.js';
import { RepeatingTimeSequence } from './RepeatingTimeSequence.js';
import { CirculatoryParameters, PARAM } from './CirculatoryParameters.js';
import { ParameterSummary } from './SummarisableParameter.js';


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
        for (var param in Object.values(PARAM)) {
            this.parameterLabels[param] = this.createSpan("", parent);
        }
    }

    private createSpan(text: string, parent: HTMLElement) {
        parent.appendChild(document.createElement('br'));
        var span = document.createElement("span");
        span.textContent = text;
        parent.appendChild(span);
        return span;
    }

    setParameters(parameters: { [id: number]: ParameterSummary }) {
        var param: any;
        for (param in Object.values(PARAM)) {
            let summary = parameters[param];
            this.parameterLabels[param].innerHTML = summary.name + ' = ' + summary.value;
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