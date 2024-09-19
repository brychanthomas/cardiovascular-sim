import { Graph } from './Graph.js';
import { RepeatingTimeSequence } from './RepeatingTimeSequence.js';
import { PARAM } from './CirculatoryParameters.js';
import { ParameterSummary } from './SummarisableParameter.js';
import { OUT } from './CirculatoryOutputs.js';
import { OutputSummary } from './Output.js';


interface HTMLElementStore {
    [key: string]: HTMLElement;
 }

export class PatientGui {

    private pressureGraph: Graph;
    private flowGraph: Graph;
    private intervalId: number = -1;
    private valueLabels: HTMLElementStore = {};
    private time = 0;

    constructor(patientRerunCallback:(e:number)=>void) {
        var wrapper = document.createElement("div");
        document.body.appendChild(wrapper);

        this.initCanvas(wrapper);

        var rightDiv = document.createElement("div");
        rightDiv.classList.add("leftFloat");
        wrapper.appendChild(rightDiv);

        this.initExerciseSlider(rightDiv, patientRerunCallback);
        this.initValueLabels(rightDiv);
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
        this.createSpan("Exercise intensity: ", parent, true);
        var slider = document.createElement("input");
        slider.setAttribute("max", "100");
        slider.setAttribute("min", "0");
        slider.setAttribute("type", "range");
        slider.setAttribute("value", "0");
        parent.appendChild(slider);
        var sliderLabel = this.createSpan('0%', parent, true);
        slider.addEventListener("input", function() {
            sliderLabel.textContent = slider.value + '%';
        });
        slider.addEventListener("change", function() {
            patientRerunCallback(Number(slider.value)/100);
        });
        parent.appendChild(document.createElement('br'));
    }

    private initValueLabels(parent: HTMLElement) {
        //parameter has its normal ID, output has +1000
        for (var group of valueGrouping) {
            var box = this.createGroupBox(parent, group.name);
            var isFirstInBox = true;
            for (var id of group.valueIds) {
                this.valueLabels[id] = this.createSpan("", box, isFirstInBox);
                if (id < 1000) { this.valueLabels[id].style.color = "cyan"; }
                else { this.valueLabels[id].style.color = "yellow"; }
                isFirstInBox = false;
            }

        }
    }

    private createSpan(text: string, parent: HTMLElement, noBr?: boolean) {
        if (!noBr) {
            parent.appendChild(document.createElement('br'));
        }
        var span = document.createElement("span");
        span.textContent = text;
        parent.appendChild(span);
        return span;
    }

    private createGroupBox(parent: HTMLElement, title: string) {
        var div = document.createElement("div");
        div.classList.add("groupingBox");
        parent.appendChild(div);
        var titleSpan = this.createSpan(title, div, true);
        titleSpan.classList.add("groupingBoxTitle");
        return div;
    }

    setValues(parameters: { [id: number]: ParameterSummary }, outputs: { [id: number]: OutputSummary }) {
        for (var idStr of Object.keys(this.valueLabels)) {
            var id = Number(idStr)
            if (id < 1000) { //parameter
                let summary = parameters[id];
                this.valueLabels[id].innerHTML = summary.name + ' = ' + summary.value;
            } else { //output
                let summary = outputs[id-1000];
                this.valueLabels[id].innerHTML = summary.name + ' = ' + summary.value;
                //check if RAP actually = 0 before doing this
                if (id === OUT.rap+1000 && summary.value === '0.00 mmHg') { this.valueLabels[id].innerHTML = 'RAP ≈ 0 mmHg' }
            }
            
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

const valueGrouping = [{
    name: 'Pressures',
    valueIds: [
            OUT.systolicPressure +1000,
            OUT.diastolicPressure +1000,
            OUT.pp +1000,
            OUT.map +1000,
            OUT.rap +1000,
            PARAM.msfp
    ]
},
{
    name: 'Cardiac properties',
    valueIds: [
        PARAM.rate,
        OUT.strokeVolume +1000,
        OUT.co +1000,
        PARAM.systoleLength,
        PARAM.aorticBackflow,
        PARAM.dicroticLength
    ]
},
{
    name: 'Vasculature properties',
    valueIds: [
        PARAM.R_p,
        PARAM.R_a,
        PARAM.C_a,
        PARAM.rvr,
    ]
}];