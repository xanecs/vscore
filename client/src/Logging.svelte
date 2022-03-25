<script lang="ts">
	import {socket, state} from './lib/stores';
import TeamEdit from './lib/TeamEdit.svelte';
import { currentScore, setScore } from './lib/utils';
	let editNames = false;
	let name0, color0, name1, color1;
	function logScore(team) {
		return () => {
			socket.emit('score', team);
		}
	}

	function undo() {
		socket.emit('undo');
	}

	function redo() {
		socket.emit('redo');
	}

	function nextSet() {
		socket.emit('nextSet');
	}

	function startEdit() {
		[name0, name1] = $state.state.teamNames;
		[color0, color1] = $state.state.teamColors;
		editNames = true;
	}

	function stopEdit() {
		socket.emit('names', name0, name1);
		socket.emit('colors', color0, color1);
		editNames = false;
	}

	function switchServe() {
		socket.emit('switchServe');
	}

	let score = [0, 0];
	let sets = [0, 0];
	$: {
		score = currentScore($state.state.sets)
		sets = setScore($state.state.sets)
	}
</script>

<main>
	<header>
		{#if editNames}
			<TeamEdit bind:name={name0} bind:color={color0}/>
			<TeamEdit bind:name={name1} bind:color={color1}/>
		{:else}
			{#each $state.state.teamNames as n, i}
			<h1 class="teamname" style="border-color: {$state.state.teamColors[i]};">{n}</h1>
			{/each}
		{/if}
	</header>
	{#if !editNames}
	<h2>Sätze</h2>
	<section class="satz">
		<div class="heim">
			<span>{sets[0]}</span>
		</div>
		<div class="gast">
			<span>{sets[1]}</span>
		</div>
	</section>
	<h2>Punkte</h2>
	<section class="score">
		
		<div class="heim">
			<span class:serving={$state.state.serving === 0}>{score[0]}</span>
			<button class="" on:click={logScore(0)}>+1</button>
		</div>
		<div class="gast">
			<span class:serving={$state.state.serving === 1}>{score[1]}</span>
			<button on:click={logScore(1)}>+1</button>
		</div>
	</section>
	<section class="spacer"></section>
	<section class="actions">
		<div class="action">
			<button class="undo" disabled={!$state.canUndo} on:click={undo}>Undo</button>
		</div>
		<div class="action">
			<button class="redo" disabled={!$state.canRedo} on:click={redo}>Redo</button>
		</div>
		<div class="action">
			<button class="next" on:click={nextSet}>Nächster Satz</button>
		</div>
		<div class="action">
			<button class="switch" on:click={switchServe}>Aufschlag tauschen</button>
		</div>
		<div class="action">
			<button class="edit" on:click={startEdit}>Namen ändern</button>
		</div>
	</section>
	{:else}
	<section class="spacer"></section>
	<section class="actions">
		<button class="save" on:click={stopEdit}>Speichern</button>
	</section>
	{/if}
</main>

<style>
	main {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	header {
		display: flex;
	}
	.teamname {
		display:  block;
		margin: 1rem;
		border-bottom-width: 0.3rem;
		border-bottom-style: solid;
		width: 50%;
	}
	h2 {
		text-align:  center;
	}
	section {
		display: flex;
		justify-content: center;
	}
	.heim {
		margin-right: 1rem;
	}
	.gast {
		margin-left: 1rem;
	}
	.heim, .gast {
		display: flex;
		flex-direction: column;
		text-align: center;
	}
	.satz > div {
		font-size: 4rem;
		width: 4rem;
	}
	.satz {
		margin-bottom: 4rem;
	}
	.score > div {
		font-size:  10rem;
		width: 20rem;
	}

	.score button {
		margin-top: 1rem;
		height: 5rem;
	}
	.spacer {
		flex-grow: 1;
	}
	.actions {
		margin-bottom:  1rem;
	}

	.actions button {
		margin: 0 1rem;
	}
	
	button {
		border: 2px solid #aaa;
		padding: 0.8rem;
		font-size: 1.8rem;
		border-radius: 5px;
	}

	span {
		border: 2px solid #aaa;
		border-radius: 5px;
		font-family: monospace;
		position: relative;
	}

	span.serving::after {
		content: ' ';
		background: white;
		border-radius: 50%;
		width: 1rem;
		height: 1rem;
		position: absolute;
		left: 1rem;
		top: 1rem;
	}
</style>