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
X  parameter mouseovers
    X  factor explanations
X  graph lables and configurable time period
X  pause button
X  diseases GUI
X  baroreflex set point parameter
X  graph 'STORE' function
X  move HTML primitives to static functions - creating box, span, etc
X  variable disease severity
X  display disease severity in brackets in factor explanation
N  fix aortic backflow = 0 during systole
-  more diseases
X  fix hypo/hypervolaemia cancelling out
X  clinical signs: cyanosis, fainting, exercise intolerance, CRT, oedema, shock, dizziness
-  Starling/Guyton curves?
X  update graph widths
*/

function initPatient() {
    var p = new Patient()
    patients.push(p);
    patientGuis.push(new PatientGui(function(e){simulateAndRenderPatient(0, e)}, p.setDiseases.bind(p)));

    simulateAndRenderPatient(patients.length-1, 0);
}

function simulateAndRenderPatient(idx: number, exercise: number) {
    patients[idx].computeSteadyState(exercise);
    var pressures = patients[idx].getAorticPressureSequence();
    var flows = patients[idx].getAorticValveFlowSequence();
    patientGuis[idx].setGraphSequences(pressures, flows);
    patientGuis[idx].setValues(patients[idx].getCirculatoryParameterSummaries(), patients[idx].getCirculatoryOutputSummaries());
    patientGuis[idx].setClinicalSigns(patients[idx].getClinicalSigns());
}

initPatient();