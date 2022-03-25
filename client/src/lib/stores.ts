import { readable } from 'svelte/store';
import { io } from 'socket.io-client';
import { backend } from './config';

const initState = {
	state: {
		teamNames: ["A", "B"],
		teamColors: ["#ff0000", "#00ff00"],
		sets: [[0, 0]],
		serving: null
	},
	canUndo: false,
	canRedo: false,
}
export const socket = io(backend);

export const state = readable(initState, (set) => {
	socket.on('state', (s) => {
		set(s);
	});
});