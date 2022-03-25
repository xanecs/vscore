const { Server } = require('socket.io');
const express = require('express');
const path = require('path')
const http = require('http');
const cors = require('cors');
const manual = require('./manual.js');
const sams = require('./sams.js');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: true
	}
});

app.use(cors());
app.use('/', express.static(path.join(__dirname, 'ui')));

const id = process.argv[process.argv.length - 1];
const useManual = id === 'manual';

if (useManual) {
	io.on('connection', (socket) => {
		console.log('client connected');
		socket.on('names', (team0, team1) => {
			io.emit('state', manual.setNames(team0, team1));
		});
		socket.on('score', (team) => {
			io.emit('state', manual.logScore(team));
		});
		socket.on('nextSet', () => {
			io.emit('state', manual.nextSet());
		});
		socket.on('undo', () => {
			io.emit('state', manual.undoState());
		});
		socket.on('redo', () => {
			io.emit('state', manual.redoState());
		});
		socket.on('colors', (color0, color1) => {
			io.emit('state', manual.setColors(color0, color1));
		});
		socket.on('switchServe', () => {
			io.emit('state', manual.switchServe());
		});
		socket.emit('state', manual.currentState());
	});
} else {
	io.on('connection', (socket) => {
		console.log('client connected');
		socket.emit('state', sams.currentState());
		socket.on('colors', (color0, color1) => {
			sams.setColors(color0, color1);
		});
	});
	sams.startSams(id);
	sams.emitter.on('state', (state) => {
		console.log('state update');
		io.emit('state', {state});
	});
}

server.listen(4000, () => {
	console.log('listening on *:4000');
})