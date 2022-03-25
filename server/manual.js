const fs = require('fs');

let stateRead = false;

const initState = {
	teamNames: ["A", "B"],
	teamColors: ["#ff0000", "#00ff00"],
	sets: [[0, 0]],
	serving: null,
};

let log = [initState];
let currentStateNum = 0;

function writeState() {
	fs.writeFile('statefile.json', JSON.stringify({log, currentStateNum}), err => {
		if (err) {
			console.error('Error writing statefile');
			console.error(err);
			console.error('Ignoring this is fine, but state will be lost if server is restarted');
		}
	})
}

function readState() {
	fs.readFile('statefile.json', (err, data) => {
		if (err) {
			console.error(err)
			console.error('If you did not expect state to be loaded, this is fine');
			return;
		}
		let ob = JSON.parse(data.toString())
		log = ob.log;
		currentStateNum = ob.currentStateNum;
	})
}

function currentState() {
	return {
		state: log[currentStateNum],
		canUndo: currentStateNum > 0,
		canRedo: currentStateNum < log.length - 1
	};
}

function pushState(nextState) {
	log.length = currentStateNum + 2;
	log[log.length-1] = nextState;
	currentStateNum += 1;
	writeState();
	return currentState();
}

function undoState() {
	if (currentStateNum > 0) currentStateNum -= 1; 
	writeState();
	return currentState();
}

function redoState() {
	if (currentStateNum < log.length - 1) currentStateNum += 1;
	writeState();
	return currentState();
}

function logScore(team) {
	let newState = structuredClone(currentState().state);
	newState.sets[newState.sets.length-1][team] += 1;
	newState.serving = team;
	return pushState(newState);
}

function nextSet() {
	let newState = structuredClone(currentState().state);
	newState.sets.push([0, 0]);
	newState.serving = null;
	return pushState(newState);
}

function setNames(team0, team1) {
	let newState = structuredClone(currentState().state);
	newState.teamNames = [team0, team1];
	return pushState(newState);
}

function setColors(color0, color1) {
	let newState = structuredClone(currentState().state);
	newState.teamColors = [color0, color1];
	return pushState(newState);
}

function switchServe() {
	let newState = structuredClone(currentState().state);
	newState.serving = 1 - newState.serving;
	return pushState(newState);
}

if (!stateRead) readState();

module.exports = {
	currentState,
	undoState,
	redoState,
	logScore,
	nextSet,
	setNames,
	setColors,
	switchServe,
}