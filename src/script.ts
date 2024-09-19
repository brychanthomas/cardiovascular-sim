import {Patient} from './Patient.js'
import {PatientGui} from './PatientGui.js';
  
var patients: Patient[] = [];
var patientGuis: PatientGui[] = [];

/*

TODO:
X  store base values in Parameter
X  add peripheral vasoconstriction - baroreflex increases R_p; increase exercise vasodilation to compensate
X  change SV to be calculated from MSFP (increased 3x by baroreflex) and RVR (decreased to 1/2 by exercise) instead of being its own parameter
    X  limit CO based on MSFP/RVR - SV decreases
N  add stressed volume parameter?
X  add RAP parameter
-  parameter mouseovers
-  baroreflex set point parameter
-  more diseases
-  Starling/Guyton curves?
-  update graph widths
*/

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
    patientGuis[idx].setValues(patients[idx].getCirculatoryParameterSummaries(), patients[idx].getCirculatoryOutputSummaries());
}

initPatient();