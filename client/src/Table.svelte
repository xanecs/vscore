<script lang="ts">
	import {state} from './lib/stores';
	import { setScore } from './lib/utils';
	let sets = [0, 0];
	  $: {
	    sets = setScore($state.state.sets)
	  }
</script>
<div class="wrapper">
<main>
	<section class="summary">
		<div style="border-color: {$state.state.teamColors[0]};">
			<span class="score">{sets[0]}</span>
			<span class="name">{$state.state.teamNames[0]}</span>
		</div>
		<div style="border-color: {$state.state.teamColors[1]};">
			<span class="score">{sets[1]}</span>
			<span class="name">{$state.state.teamNames[1]}</span>
		</div>
	</section>
	<section class="results">
		{#each $state.state.sets as s, i}
		<div class="row">
			<span class="point">
		{s[0]}</span>
			<span class="index">({i+1})</span>
			<span class="point">
		{s[1]}</span>
		</div>
		{/each}
	</section>
</main>
</div>
<style>
	.wrapper {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	main {
	 	font-family: 'Helvetica Neue';
	 	border: 2px solid #666;
	 	border-radius: 8px;
	 	overflow: hidden;
	 	min-width: 600px;
	 	font-size: 24px;
	}
	.summary {
		background: white;
		display: flex;
		justify-content: space-around;
		padding: 10px 10px;
		border-bottom: 1px solid #666;
	}

	.summary > div {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 50%;
		margin: 10px;
		padding-bottom: 10px;
		border-bottom: 4px solid #fff;
	}

	.summary .score {
		font-family: 'Menlo';
		font-weight: bold;
		font-size: 60px;
		margin-bottom: 10px;
	}

	.results {
		background: #eee;
		padding: 20px 30px;
	}

	.row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.point {
		font-family: 'Menlo';
		font-weight: bold;
		width: 30px;
	}
	.point:last-child {
		text-align: right;
	}
</style>