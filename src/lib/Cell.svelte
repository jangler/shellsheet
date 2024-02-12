<script lang="ts" context="module">
	import { writable } from 'svelte/store';

	type Cell = { name: string; value: any; editable: boolean };

	const { subscribe, set, update } = writable([] as Cell[]);

	export const cells = {
		subscribe: subscribe,
		clear: () => set([]),
		push: (cell: Cell) => update((cs) => [...cs, cell]),
		remove: (name: string) => update((cs) => cs.filter((c) => c.name !== name))
	};

	let cellNames = new Set();
	cells.subscribe((cs) => {
		cellNames.clear();
		for (const cell of cs) {
			cellNames.add(cell.name);
		}
	});

	export function firstFreeName() {
		let i = 1;
		while (true) {
			let name = `#${i}`;
			if (!cellNames.has(name)) return name;
			i++;
		}
	}
</script>

<script lang="ts">
	import { messages } from './Message.svelte';
	import { tick } from 'svelte';
	import { showContextMenu } from './ContextMenu.svelte';

	// type fn = () => any;

	export let name: string;
	export let value: any;
	export let editable = true;

	function updateId(e: Event) {
		let target = e.target as HTMLInputElement;
		let key = target.value;
		if (key === name) return;
		if (cellNames.has(key)) {
			messages.postError(`Cell '${key}' already exists`);
			target.value = name;
		} else {
			// FIXME: This doesn't propogate to the original cell object.
			messages.postInfo(`Cell '${name}' updated to '${key}'`);
			name = key;
		}
		tick().then(() => {
			console.log(cellNames);
		});
	}

	function handleUpdateValue() {
		// TODO
	}

	function removeCell() {
		cells.remove(name);
	}

	function showCellContextMenu(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		showContextMenu(e.clientX, e.clientY, [{ text: 'Remove cell', callback: removeCell }]);
	}
</script>

<div class="cell" on:contextmenu={showCellContextMenu}>
	<div class="header">
		<input id="id" type="text" size="8" value={name} on:change={updateId} on:focusout={updateId} />
		<div class="type">{typeof value}</div>
	</div>
	{#if editable}
		{#if typeof value === 'number'}
			<input type="number" {value} on:change={handleUpdateValue} on:focusout={handleUpdateValue} />
		{/if}
	{:else}
		<div class="content">
			{value}
		</div>
	{/if}
</div>

<style>
	div.cell {
		border: 1px solid gray;
		border-radius: 2px;
		margin: 0.5rem;
		width: fit-content;
	}
	div.content {
		padding: 0.5rem;
	}
	div.header {
		margin: 0;
		padding: 0.5rem;
		background-color: lightblue;
	}
	div.header input {
		background-color: inherit;
		border: 0;
		font-size: large;
		font-weight: bold;
	}
	div.type {
		font-style: italic;
		font-size: small;
	}
</style>
