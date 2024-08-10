import {Patient} from './Patient.js'
import {PatientGui} from './PatientGui.js';
  
var patients: Patient[] = [];
var patientGuis: PatientGui[] = [];

function initPatient() {
    patients.push(new Patient());
    patientGuis.push(new PatientGui(function(e){simulateAndRenderPatient(0, e)}));

    simulateAndRenderPatient(patients.length-1, 0);
}

function simulateAndRenderPatient(idx: number, exercise: number) {
    patients[idx].computeSteadyState(exercise);
    var pressures = patients[idx].getAorticPressureSequence();
    var flows = patients[idx].getAorticValveFlowSequence();
    console.log(patients[idx].getPressureString());
    console.log(patients[idx].getMAP());
    patientGuis[idx].setGraphSequences(pressures, flows);
    patientGuis[idx].setParameters(patients[idx].getParameterValuesAndChanges());
}

initPatient();