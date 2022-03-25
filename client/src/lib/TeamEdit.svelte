<script lang="ts">
	export let name = '';
	export let color = '#ff0000';
</script>

<div>
	<input type="color" bind:value={color}>
	<input type="text" bind:value={name}>
</div>

<style>
div, input {
	font-size: 1.8rem;
	width: 100%;
}

input {
	border: 1px solid #999;
	border-radius: 5px;
}

div {
	margin: 0.5rem;
}

</style>