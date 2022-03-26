const ws = require('reconnecting-ws');
const EventEmitter = require('events');
const fs = require('fs');

let state = {
	teamNames: ["A", "B"],
	teamColors: ["#ff0000", "#00ff00"],
	sets: [[0, 0]],
	serving: null,
};

const emitter = new EventEmitter()

function currentState() {
	return {
		state
	}
}

function setColors(color0, color1) {
	state.teamColors = [color0, color1];
	emitter.emit('state', state);
	fs.writeFile('colors.json', JSON.stringify([color0, color1]), err => {
		if (err) {
			console.error('Could not persist colors to disk');
		}
	});
}

function loadColors() {
	fs.readFile('colors.json', (err, data) => {
		if (err) {
			console.error(err)
			console.error('If you did not expect colors to be loaded, this is fine');
			return;
		}
		let ob = JSON.parse(data.toString())
		state.teamColors = ob;
	});
}

function processState(payload) {
	state.serving = payload.serving === 'team2' ? 1 : 0;
	state.sets = payload.matchSets.map((s) => [s.setScore.team1, s.setScore.team2]);
}

function startSams(id) {
	const wsc = new ws.WebSocketClient(2000, true);
	wsc.connect('wss://backend.sams-ticker.de/dvv-main');
	wsc.on('message', (data) => {
		const msg = JSON.parse(data.toString());
		if (msg.type === 'FETCH_ASSOCIATION_TICKER_RESPONSE') {
			let found = false;
			for (let day of msg.payload.matchDays) {
				for (let match of day.matches) {
					if (match.id === id) {
						found = true;
						state.teamNames = [match.team1.name, match.team2.name];
					}
				}
			}
			if (msg.payload.matchStates[id]) {
				processState(msg.payload.matchStates[id]);
			}
			emitter.emit('state', state);
			if (!found) {
				console.error(`No match with id ${id} found.`);
				process.exit(1);
			}
		} else if (msg.type === 'MATCH_UPDATE' && msg.payload.matchUuid === id) {
			processState(msg.payload);
			emitter.emit('state', state);
		}
		
	});
}
loadColors();

module.exports = {
	startSams,
	currentState,
	setColors,
	emitter
};