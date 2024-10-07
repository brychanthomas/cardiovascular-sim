import { Graph } from './Graph.js';
import { PARAM } from './CirculatoryParameters.js';
import { OUT } from './CirculatoryOutputs.js';
import { DiseaseStore } from './Diseases.js';
import { HTMLPrimitives } from './HTMLPrimitives.js';
/**
 * Creates DOM user interface, updates values displayed and accepts user
 * input using callback functions.
 */
export class PatientGui {
    constructor(patientRerunCallback, patientDiseaseSetCallback) {
        this.intervalId = -1;
        this.valueLabels = {};
        this.hoverBoxes = {};
        this.time = 0;
        this.paused = false;
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
    /**
     * Create canvas DOM element and two Graph objects to write to it
     * @param parent parent element for canvas
     */
    initCanvas(parent) {
        var canvas = document.createElement("canvas");
        parent.appendChild(canvas);
        var ctx = canvas.getContext("2d");
        ctx.canvas.width = window.innerWidth / 1.8;
        ctx.canvas.height = 520;
        this.pressureGraph = new Graph(canvas, 60, 10, ctx.canvas.width - 100, 200, 5);
        this.pressureGraph.setYLabel("Aortic pressure (mmHg)");
        this.flowGraph = new Graph(canvas, 60, 260, ctx.canvas.width - 100, 200, 5);
        this.flowGraph.setYLabel("Aortic valve flow (mL/s)");
        window.addEventListener('resize', function () {
            ctx.canvas.width = window.innerWidth / 1.8;
            this.pressureGraph.setWidth(ctx.canvas.width - 100);
            this.flowGraph.setWidth(ctx.canvas.width - 100);
        }.bind(this), true);
    }
    /**
     * Create exercise intensity slider
     * @param parent parent element for slider
     * @param patientRerunCallback callback function for when slider moved
     */
    initExerciseSlider(parent, patientRerunCallback) {
        this.exerciseSlider = HTMLPrimitives.slider(parent, "Exercise intensity: ", 100, '%');
        this.exerciseSlider.addEventListener("change", function () {
            patientRerunCallback(Number(this.exerciseSlider.value) / 100);
        }.bind(this));
        parent.appendChild(document.createElement('br'));
    }
    /**
     * Create elements to display parameter and output values plus pop-up hover boxes
     * @param parent parent to create elements inside
     */
    initValueLabels(parent) {
        for (var group of valueGrouping) {
            var box = HTMLPrimitives.groupBox(parent, group.name);
            var isFirstInBox = true;
            for (var id of group.valueIds) {
                this.valueLabels[id] = HTMLPrimitives.span(box, "", isFirstInBox);
                if (id < 1000) { //parameter
                    this.valueLabels[id].style.color = "cyan";
                    this.hoverBoxes[id] = HTMLPrimitives.hoverBox(box, this.valueLabels[id], '#dce0f4');
                }
                else { //output
                    this.valueLabels[id].style.color = "yellow";
                    this.hoverBoxes[id] = HTMLPrimitives.hoverBox(box, this.valueLabels[id], '#f5f5dc');
                }
                isFirstInBox = false;
            }
        }
    }
    /**
     * Update displayed parameter and output values
     * @param parameters object mapping parameter ID to ParameterSummary for all parameters
     * @param outputs object mapping output ID to OutputSummary for all outputs
     */
    setValues(parameters, outputs) {
        for (var idStr of Object.keys(this.valueLabels)) {
            var id = Number(idStr);
            if (id < 1000) { //parameter
                let summary = parameters[id];
                this.valueLabels[id].innerHTML = summary.name + ' = ' + summary.value;
                this.hoverBoxes[id].innerHTML = this.parameterSummaryToText(summary);
            }
            else { //output
                let summary = outputs[id];
                this.valueLabels[id].innerHTML = summary.name + ' = ' + summary.value;
                if (id === OUT.rap && summary.value === '0.00 mmHg') {
                    this.valueLabels[id].innerHTML = 'RAP ≈ 0 mmHg';
                }
                this.hoverBoxes[id].innerHTML = `<span><b>${summary.description}</b> (output)</span>`;
            }
        }
    }
    /**
     * Convert ParameterSummary to text to be displayed in hover box
     * @param s ParameterSummary object
     * @returns HTML showing description, base value and factor list
     */
    parameterSummaryToText(s) {
        var text = `<span><b>${s.description}</b> (input)</span><br>
                    <span>Base value: ${s.base}</span><br><hr>`;
        var modifiers = [];
        if (s.exerciseFactor) {
            modifiers.push(s.exerciseFactor);
        }
        if (s.baroreflexFactor) {
            modifiers.push(s.baroreflexFactor);
        }
        modifiers = s.diseaseFactors.concat(modifiers);
        if (modifiers.length > 0) {
            text += '<ul><li><span>';
            text += modifiers.join("</span></li><li><span>");
            text += '</span></li></ul>';
        }
        else {
            text += '<span>No modifiers</span>';
        }
        return text;
    }
    /**
     * Set sequences to be displayed in pressure and flow graphs
     * @param pressures RepeatingTimeSequence of pressure over one beat
     * @param flows RepeatingTimeSequence of flow over one beat
     */
    setGraphSequences(pressures, flows) {
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
        this.intervalId = setInterval(function () {
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
    /**
     * Create box with control buttons (pause, store, clear, diseases) and
     * exercise slider
     * @param parent element to place box inside
     * @param patientRerunCallback callback for when exercise slider moved
     */
    initControls(parent, patientRerunCallback) {
        var div = HTMLPrimitives.groupBox(parent, "Controls");
        div.style.marginLeft = '60px';
        div.style.marginRight = '40px';
        this.initExerciseSlider(div, patientRerunCallback);
        div.appendChild(document.createElement("br"));
        var pauseButton = document.createElement("button");
        pauseButton.textContent = 'Pause';
        div.appendChild(pauseButton);
        pauseButton.onclick = function () {
            this.paused = !this.paused;
            pauseButton.textContent = this.paused ? 'Play ' : 'Pause';
        }.bind(this);
        pauseButton.style.width = '5em';
        var storeButton = document.createElement("button");
        storeButton.textContent = 'Store';
        div.appendChild(storeButton);
        storeButton.onclick = function () {
            this.pressureGraph.store();
            this.flowGraph.store();
        }.bind(this);
        storeButton.style.marginLeft = '10px';
        storeButton.style.width = '5em';
        var storeButton = document.createElement("button");
        storeButton.textContent = 'Clear';
        div.appendChild(storeButton);
        storeButton.onclick = function () {
            this.pressureGraph.clearStored();
            this.flowGraph.clearStored();
        }.bind(this);
        storeButton.style.marginLeft = '10px';
        storeButton.style.width = '5em';
        var diseasesButton = document.createElement("button");
        diseasesButton.textContent = 'Diseases';
        div.appendChild(diseasesButton);
        diseasesButton.onclick = function () {
            document.getElementById("diseaseWindow").style.display = 'block';
        }.bind(this);
        diseasesButton.style.marginLeft = '10px';
        diseasesButton.style.width = '5em';
    }
    /**
     * Create disease GUI (window) - listing of diseases with checkboxes and
     * intensity sliders
     * @param patientRerunCallback callback to resimulate patient with given exercise intensity
     * @param patientDiseaseSetCallback callback to set diseases patient is afflicted by
     */
    initDiseaseGui(patientRerunCallback, patientDiseaseSetCallback) {
        var div = document.createElement("div");
        div.id = "diseaseWindow";
        document.body.appendChild(div);
        var tbl = document.createElement("table");
        div.appendChild(tbl);
        tbl.innerHTML = '<tr><th>Name</th><th>Severity</th></tr>';
        for (var disease of DiseaseStore.getAllDiseaseNames()) {
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
            let diseaseObj = DiseaseStore.getDiseaseFromName(disease);
            let severitySlider = HTMLPrimitives.slider(td, '', diseaseObj.getMaxSeverity(), diseaseObj.getSeverityUnit());
            severitySlider.addEventListener("change", function () {
                diseaseObj.setSeverity(Number(severitySlider.value));
            }.bind(this));
            row.appendChild(td);
            tbl.appendChild(row);
        }
        var closeButton = document.createElement("button");
        closeButton.textContent = "Close";
        closeButton.id = "diseasesCloseButton";
        closeButton.onclick = function () {
            var checkedBoxes = document.querySelectorAll('input[name=diseaseCheckbox]:checked');
            var diseases = [];
            for (var box of checkedBoxes) {
                diseases.push(box.value);
            }
            patientDiseaseSetCallback(DiseaseStore.getDiseaseListFromNameList(diseases));
            patientRerunCallback(Number(this.exerciseSlider.value) / 100);
            div.style.display = 'none';
        }.bind(this);
        div.appendChild(closeButton);
    }
    /**
     * Create box to list clinical signs
     * @param parent element to create box within
     */
    initClinicalSigns(parent) {
        this.clinicalSignsBox = HTMLPrimitives.groupBox(parent, "Clinical signs");
        this.clinicalSignsBox.style.marginLeft = "10px";
        HTMLPrimitives.span(this.clinicalSignsBox, "None").classList.add("clinicalSigns");
    }
    /**
     * Update the clinical signs to list in clinical signs box
     * @param signs list of string clinical sign names
     */
    setClinicalSigns(signs) {
        this.clinicalSignsBox.innerHTML = '';
        HTMLPrimitives.span(this.clinicalSignsBox, "Clinical signs", true).classList.add("groupingBoxTitle");
        if (signs.length === 0) {
            HTMLPrimitives.span(this.clinicalSignsBox, "None");
        }
        else {
            var html = '<ul>';
            for (var i = 0; i < signs.length; i++) {
                //this.clinicalSignsBox.appendChild(document.createElement("br"));
                html += '<li><span>' + signs[i] + '</span></li>';
            }
            this.clinicalSignsBox.innerHTML += html + '</ul>';
        }
    }
}
/**
 * Grouping and ordering of parameters and outputs to display
 */
const valueGrouping = [{
        name: 'Pressures',
        valueIds: [
            OUT.systolicPressure,
            OUT.diastolicPressure,
            OUT.pp,
            OUT.map,
            PARAM.baroreflexSetPoint,
            OUT.rap,
            PARAM.msfp
        ]
    },
    {
        name: 'Cardiac properties',
        valueIds: [
            PARAM.rate,
            OUT.strokeVolume,
            PARAM.maxStrokeVolume,
            OUT.co,
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
    }
];
