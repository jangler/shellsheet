<script lang="ts" context="module">
	import { writable } from 'svelte/store';

	type Item = {
		text: string;
		callback: () => void;
	};

	let visible = writable(false);
	let x = writable(0);
	let y = writable(0);
	let items = writable([] as Item[]);

	export function showContextMenu(x_: number, y_: number, items_: Item[]) {
		x.set(x_);
		y.set(y_);
		items.set(items_);
		visible.set(true);
	}

	// TODO: Add keyboard accelerators.
</script>

<svelte:document on:mouseup={() => visible.set(false)} />

{#if $visible}
	<menu style:left={`${$x}px`} style:top={`${$y - 16}px`}>
		{#each $items as item}
			<li><button on:mouseup={item.callback}>{item.text}</button></li>
		{/each}
	</menu>
{/if}

<style>
	menu {
		position: absolute;
		background-color: white;
		border: 1px solid black;
		border-radius: 2px;
		padding: 0;
		list-style: none;
	}
	menu li button {
		background-color: inherit;
		border: 0;
		border-radius: 0;
		text-align: left;
		padding: 0.4rem;
		width: 100%;
	}
	menu li button:hover {
		background-color: hsl(200, 80%, 95%);
	}
	menu li button:active {
		background-color: hsl(200, 90%, 90%);
	}
</style>
