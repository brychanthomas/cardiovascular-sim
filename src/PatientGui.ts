import { Graph } from './Graph.js';
import { RepeatingTimeSequence } from './RepeatingTimeSequence.js';
import { PARAM } from './CirculatoryParameters.js';
import { ParameterSummary } from './SummarisableParameter.js';
import { OUT } from './CirculatoryOutputs.js';
import { OutputSummary } from './Output.js';
import { Diseases } from './Diseases.js';
import type { Disease } from './Disease.js';

interface HTMLElementStore {
    [key: string]: HTMLElement;
 }

export class PatientGui {

    private pressureGraph: Graph;
    private flowGraph: Graph;
    private intervalId: number = -1;
    private valueLabels: HTMLElementStore = {};
    private hoverBoxes: HTMLElementStore = {};
    private time = 0;
    private paused = false;
    private exerciseSlider: HTMLInputElement;

    constructor(patientRerunCallback:(e:number)=>void, patientDiseaseSetCallback:(d:Disease[])=>void) {
        var wrapper = document.createElement("div");
        document.body.appendChild(wrapper);

        this.initCanvas(wrapper);

        var rightDiv = document.createElement("div");
        rightDiv.classList.add("leftFloat");
        wrapper.appendChild(rightDiv);

        this.initExerciseSlider(rightDiv, patientRerunCallback);
        this.initValueLabels(rightDiv);

        this.initDiseaseGui(patientRerunCallback, patientDiseaseSetCallback);
    }

    private initCanvas(parent: HTMLElement) {
        var div = document.createElement("div");
        var canvas = document.createElement("canvas");
        div.classList.add("leftFloat");
        div.appendChild(canvas);
        parent.appendChild(div);
        
        var ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
        ctx.canvas.width  = window.innerWidth/2;
        ctx.canvas.height = window.innerHeight - 50;

        this.pressureGraph = new Graph(canvas, 60, 10, ctx.canvas.width - 100, 200, 5);
        this.pressureGraph.setYLabel("Aortic pressure (mmHg)");
        this.flowGraph = new Graph(canvas, 60, 310, ctx.canvas.width - 100, 200, 5);
        this.flowGraph.setYLabel("Aortic valve flow (mL/s)");

        this.createPauseButton(div);

    }

    private initExerciseSlider(parent: HTMLElement, patientRerunCallback:(e:number)=>void) {
        this.createSpan("Exercise intensity: ", parent, true);
        this.exerciseSlider = document.createElement("input");
        this.exerciseSlider.setAttribute("max", "100");
        this.exerciseSlider.setAttribute("min", "0");
        this.exerciseSlider.setAttribute("type", "range");
        this.exerciseSlider.setAttribute("value", "0");
        parent.appendChild(this.exerciseSlider);
        var sliderLabel = this.createSpan('0%', parent, true);
        this.exerciseSlider.addEventListener("input", function() {
            sliderLabel.textContent = this.exerciseSlider.value + '%';
        }.bind(this));
        this.exerciseSlider.addEventListener("change", function() {
            patientRerunCallback(Number(this.exerciseSlider.value)/100);
        }.bind(this));
        parent.appendChild(document.createElement('br'));
    }

    private initValueLabels(parent: HTMLElement) {
        //parameter has its normal ID, output has +1000
        for (var group of valueGrouping) {
            var box = this.createGroupBox(parent, group.name);
            var isFirstInBox = true;
            for (var id of group.valueIds) {
                this.valueLabels[id] = this.createSpan("", box, isFirstInBox);
                if (id < 1000) { 
                    this.valueLabels[id].style.color = "cyan";
                    this.hoverBoxes[id] = this.createHoverBox(box, this.valueLabels[id], '#dce0f4');
                 }
                else { 
                    this.valueLabels[id].style.color = "yellow";
                    this.hoverBoxes[id] = this.createHoverBox(box, this.valueLabels[id], '#f5f5dc');
                 }
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

    private createHoverBox(parent: HTMLElement, hoverText: HTMLSpanElement, colour: string) {
        var box = document.createElement("div");
        box.classList.add("hoverBox");
        box.style.backgroundColor = colour;
        hoverText.onmousemove = function (e) {
            box.style.display = "block";
            box.style.left = e.clientX + 'px';
            box.style.top = e.clientY + 5 + 'px';
        }
        hoverText.onmouseleave = function() {
            box.style.display = "none";
        }
        parent.appendChild(box);
        return box;
    }

    setValues(parameters: { [id: number]: ParameterSummary }, outputs: { [id: number]: OutputSummary }) {
        for (var idStr of Object.keys(this.valueLabels)) {
            var id = Number(idStr)
            if (id < 1000) { //parameter
                let summary = parameters[id];
                this.valueLabels[id].innerHTML = summary.name + ' = ' + summary.value;
                this.hoverBoxes[id].innerHTML = this.parameterSummaryToText(summary);
            } else { //output
                let summary = outputs[id-1000];
                this.valueLabels[id].innerHTML = summary.name + ' = ' + summary.value;
                if (id === OUT.rap+1000 && summary.value === '0.00 mmHg') { this.valueLabels[id].innerHTML = 'RAP ≈ 0 mmHg' }
                this.hoverBoxes[id].innerHTML = `<span><b>${summary.description}</b> (output)</span>`;
            }
            
        }
    }

    private parameterSummaryToText(s: ParameterSummary) {
        var text = `<span><b>${s.description}</b> (input)</span><br>
                    <span>Base value: ${s.base}</span><br><hr>`;
        var modifiers = [];
        if (s.exerciseFactor) { modifiers.push(s.exerciseFactor); }
        if (s.baroreflexFactor) { modifiers.push(s.baroreflexFactor); }
        modifiers = modifiers.concat(s.diseaseFactors);
        if (modifiers.length>0) {
            text += '<ul><li><span>';
            text += modifiers.join("</span></li><li><span>");
            text += '</span></li></ul>'
        } else {
            text += '<span>No modifiers</span>'
        }
        return text;
    }

    setGraphSequences(pressures: RepeatingTimeSequence, flows: RepeatingTimeSequence) {
        if (this.intervalId != -1) {
            clearInterval(this.intervalId);
        }
        this.pressureGraph.clearValues();
        this.flowGraph.clearValues();
        this.time = 0;
        this.intervalId = setInterval(function(){
            if (!this.paused) {
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

    private createPauseButton(parent: HTMLElement) {
        parent.appendChild(document.createElement("br"));
        var button = document.createElement("button");
        button.textContent = 'Pause';
        button.id = 'pauseButton';
        parent.appendChild(button);
        button.onclick = function() {
            this.paused = !this.paused;
            button.textContent = this.paused ? 'Play': 'Pause';
        }.bind(this);

        var diseasesButton = document.createElement("button");
        diseasesButton.textContent = 'Diseases';
        diseasesButton.id = 'diseasesButton';
        parent.appendChild(diseasesButton);
        diseasesButton.onclick = function() {
            document.getElementById("diseaseWindow").style.display = 'block';
        }.bind(this);
    }

    private initDiseaseGui(patientRerunCallback:(e:number)=>void, patientDiseaseSetCallback:(d:Disease[])=>void) {
        var div = document.createElement("div");
        div.id = "diseaseWindow";
        document.body.appendChild(div);
        var form = document.createElement("form");
        div.appendChild(form);
        for (var disease of Diseases.getAllDiseaseNames()) {
            var label = document.createElement("label");
            var input = document.createElement("input");
            input.type = "checkbox";
            input.value = disease;
            input.name = "diseaseCheckbox";
            input.onchange = function() {
                var checkedBoxes = document.querySelectorAll('input[name=diseaseCheckbox]:checked');
                var diseases: string[] = [];
                for (var box of checkedBoxes) { diseases.push((<HTMLInputElement>box).value) }
                patientDiseaseSetCallback(Diseases.getDiseaseListFromNameList(diseases));
                patientRerunCallback(Number(this.exerciseSlider.value)/100);
            }.bind(this);
            label.appendChild(input);
            this.createSpan(disease, label, true);
            form.appendChild(label);
            form.appendChild(document.createElement("br"));
        }
        var closeButton = document.createElement("button");
        closeButton.textContent = "Close";
        closeButton.id = "diseasesCloseButton";
        closeButton.onclick = function() { div.style.display = 'none'; }
        div.appendChild(closeButton);
    }

}

const valueGrouping = [{
    name: 'Pressures',
    valueIds: [
            OUT.systolicPressure +1000,
            OUT.diastolicPressure +1000,
            OUT.pp +1000,
            OUT.map +1000,
            PARAM.baroreflexSetPoint,
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