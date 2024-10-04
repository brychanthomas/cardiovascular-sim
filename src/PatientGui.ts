import { Graph } from './Graph.js';
import { RepeatingTimeSequence } from './RepeatingTimeSequence.js';
import { PARAM } from './CirculatoryParameters.js';
import { ParameterSummary } from './SummarisableParameter.js';
import { OUT } from './CirculatoryOutputs.js';
import { OutputSummary } from './Output.js';
import { Diseases } from './Diseases.js';
import type { Disease } from './Disease.js';
import { HTMLPrimitives } from './HTMLPrimitives.js';

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
    private clinicalSignsBox: HTMLElement;

    constructor(patientRerunCallback:(e:number)=>void, patientDiseaseSetCallback:(d:Disease[])=>void) {
        var wrapper = document.createElement("div");
        document.body.appendChild(wrapper);

        var leftDiv = document.createElement("div");
        leftDiv.classList.add("leftFloat");
        wrapper.appendChild(leftDiv);

        this.initControls(leftDiv, patientRerunCallback);
        this.initCanvas(leftDiv);

        var middleDiv = document.createElement("div");
        middleDiv.classList.add("leftFloat");
        wrapper.appendChild(middleDiv);
        this.initValueLabels(middleDiv);

        var rightDiv = document.createElement("div");
        rightDiv.id = "rightDiv";
        wrapper.appendChild(rightDiv);
        this.initClinicalSigns(rightDiv);

        this.initDiseaseGui(patientRerunCallback, patientDiseaseSetCallback);
    }

    private initCanvas(parent: HTMLElement) {
        var canvas = document.createElement("canvas");
        parent.appendChild(canvas);
        
        var ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
        ctx.canvas.width  = window.innerWidth/1.8;
        ctx.canvas.height = 520;

        this.pressureGraph = new Graph(canvas, 60, 10, ctx.canvas.width - 100, 200, 5);
        this.pressureGraph.setYLabel("Aortic pressure (mmHg)");
        this.flowGraph = new Graph(canvas, 60, 260, ctx.canvas.width - 100, 200, 5);
        this.flowGraph.setYLabel("Aortic valve flow (mL/s)");

        window.addEventListener('resize', function() {
            ctx.canvas.width = window.innerWidth/1.8;
            this.pressureGraph.setWidth(ctx.canvas.width - 100);
            this.flowGraph.setWidth(ctx.canvas.width - 100);
        }.bind(this), true);

    }

    private initExerciseSlider(parent: HTMLElement, patientRerunCallback:(e:number)=>void) {
        this.exerciseSlider = HTMLPrimitives.slider(parent, "Exercise intensity: ", 100, '%');
        this.exerciseSlider.addEventListener("change", function() {
            patientRerunCallback(Number(this.exerciseSlider.value)/100);
        }.bind(this));
        parent.appendChild(document.createElement('br'));
    }

    private initValueLabels(parent: HTMLElement) {
        //parameter has its normal ID, output has +1000
        for (var group of valueGrouping) {
            var box = HTMLPrimitives.groupBox(parent, group.name);
            var isFirstInBox = true;
            for (var id of group.valueIds) {
                this.valueLabels[id] = HTMLPrimitives.span(box, "", isFirstInBox);
                if (id < 1000) { 
                    this.valueLabels[id].style.color = "cyan";
                    this.hoverBoxes[id] = HTMLPrimitives.hoverBox(box, this.valueLabels[id], '#dce0f4');
                 }
                else { 
                    this.valueLabels[id].style.color = "yellow";
                    this.hoverBoxes[id] = HTMLPrimitives.hoverBox(box, this.valueLabels[id], '#f5f5dc');
                 }
                isFirstInBox = false;
            }

        }
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
        modifiers = s.diseaseFactors.concat(modifiers);
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
        let [t, p] = pressures.getNextValue(); //populate first 10s of graphs
        while (t < 10) {
            this.pressureGraph.addValue(t, p);
            pressures.popNextValue();
            let [t1, q] = flows.popNextValue();
            this.flowGraph.addValue(t1, q);
            [t, p] = pressures.getNextValue();
        }
        this.time = t;
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

    private initControls(parent: HTMLElement, patientRerunCallback:(e:number)=>void) {
        var div = HTMLPrimitives.groupBox(parent, "Controls");
        div.style.marginLeft = '60px';
        div.style.marginRight = '40px';
        this.initExerciseSlider(div, patientRerunCallback);
        div.appendChild(document.createElement("br"));

        var pauseButton = document.createElement("button");
        pauseButton.textContent = 'Pause';
        div.appendChild(pauseButton);
        pauseButton.onclick = function() {
            this.paused = !this.paused;
            pauseButton.textContent = this.paused ? 'Play ': 'Pause';
        }.bind(this);
        pauseButton.style.width = '5em';

        var storeButton = document.createElement("button");
        storeButton.textContent = 'Store';
        div.appendChild(storeButton);
        storeButton.onclick = function() {
            this.pressureGraph.store();
            this.flowGraph.store();
        }.bind(this);
        storeButton.style.marginLeft = '10px';
        storeButton.style.width = '5em';

        var storeButton = document.createElement("button");
        storeButton.textContent = 'Clear';
        div.appendChild(storeButton);
        storeButton.onclick = function() {
            this.pressureGraph.clearStored();
            this.flowGraph.clearStored();
        }.bind(this);
        storeButton.style.marginLeft = '10px';
        storeButton.style.width = '5em';

        var diseasesButton = document.createElement("button");
        diseasesButton.textContent = 'Diseases';
        div.appendChild(diseasesButton);
        diseasesButton.onclick = function() {
            document.getElementById("diseaseWindow").style.display = 'block';
        }.bind(this);
        diseasesButton.style.marginLeft = '10px';
        diseasesButton.style.width = '5em';
    }

    private initDiseaseGui(patientRerunCallback:(e:number)=>void, patientDiseaseSetCallback:(d:Disease[])=>void) {
        var div = document.createElement("div");
        div.id = "diseaseWindow";
        document.body.appendChild(div);
        var tbl = document.createElement("table");
        div.appendChild(tbl);
        tbl.innerHTML = '<tr><th>Name</th><th>Severity</th></tr>';
        for (var disease of Diseases.getAllDiseaseNames()) {
            var row = document.createElement('tr');
            var label = document.createElement("label");
            var input = document.createElement("input");
            var td = document.createElement('td');
            td.appendChild(input);
            input.type = "checkbox";
            input.value = disease;
            input.name = "diseaseCheckbox";
            label.appendChild(td);
            HTMLPrimitives.span(td, disease, true);
            label.appendChild(td);
            row.appendChild(label);
            td = document.createElement('td');
            let diseaseObj = Diseases.getDiseaseFromName(disease);
            let severitySlider = HTMLPrimitives.slider(td, '', diseaseObj.getMaxSeverity(), diseaseObj.getSeverityUnit());
            severitySlider.addEventListener("change", function() {
                diseaseObj.setSeverity(Number(severitySlider.value));
            }.bind(this));
            row.appendChild(td);
            tbl.appendChild(row);
        }
        var closeButton = document.createElement("button");
        closeButton.textContent = "Close";
        closeButton.id = "diseasesCloseButton";
        closeButton.onclick = function() { 
            var checkedBoxes = document.querySelectorAll('input[name=diseaseCheckbox]:checked');
            var diseases: string[] = [];
            for (var box of checkedBoxes) { diseases.push((<HTMLInputElement>box).value) }
            patientDiseaseSetCallback(Diseases.getDiseaseListFromNameList(diseases));
            patientRerunCallback(Number(this.exerciseSlider.value)/100);
            div.style.display = 'none';
         }.bind(this);
        div.appendChild(closeButton);
    }

    initClinicalSigns(parent: HTMLElement) {
        this.clinicalSignsBox = HTMLPrimitives.groupBox(parent, "Clinical signs");
        this.clinicalSignsBox.style.marginLeft = "10px";
        HTMLPrimitives.span(this.clinicalSignsBox, "None").classList.add("clinicalSigns");
    }

    setClinicalSigns(signs: string[]) {
        this.clinicalSignsBox.innerHTML = '';
        HTMLPrimitives.span(this.clinicalSignsBox, "Clinical signs", true).classList.add("groupingBoxTitle");
        if (signs.length === 0) {
            HTMLPrimitives.span(this.clinicalSignsBox, "None");
        } else {
            var html = '<ul>';
            for (var i = 0; i<signs.length; i++) {
                //this.clinicalSignsBox.appendChild(document.createElement("br"));
                html += '<li><span>'+signs[i]+'</span></li>';
            }
            this.clinicalSignsBox.innerHTML += html + '</ul>';
        }
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
        PARAM.maxStrokeVolume,
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