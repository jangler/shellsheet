<script lang="ts">
	import { showContextMenu } from './ContextMenu.svelte';
	import { messages } from './Message.svelte';

	type Cell = {
		name: string;
		value: any;
		generate?: () => any;
		dependsOn: Cell[];
		dependents: Cell[];
	};
	let cells: Cell[] = [];

	function firstFreeName() {
		let i = 1;
		let cellNames = new Set(cells.map((c) => c.name));
		while (true) {
			let name = `#${i}`;
			if (!cellNames.has(name)) return name;
			i++;
		}
	}

	function addCell(cell: Cell) {
		for (const c of cell.dependsOn) {
			c.dependents.push(cell);
		}
		if (cell.generate) {
			cell.value = cell.generate();
		}
		cells = [...cells, cell];
	}

	function addNumberCell() {
		addCell({
			name: firstFreeName(),
			value: 0,
			dependsOn: [],
			dependents: []
		});
	}

	function addDoubleCell() {
		if (cells.length === 0) {
			messages.postError('Missing source cell');
			return;
		}
		let source = cells[cells.length - 1];
		addCell({
			name: firstFreeName(),
			value: undefined,
			generate: () => source.value * 2,
			dependsOn: [source],
			dependents: []
		});
	}

	function showWorkspaceContextMenu(e: MouseEvent) {
		e.preventDefault();
		showContextMenu(e.clientX, e.clientY, [
			{ text: 'Add number cell', callback: addNumberCell },
			{ text: 'Add double cell', callback: addDoubleCell },
			{ text: 'Clear workspace', callback: () => (cells = []) }
		]);
	}

	function removeCell(cell: Cell) {
		cells = cells.filter((c) => c !== cell);
	}

	function cellContextMenuCallback(cell: Cell) {
		return (e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			showContextMenu(e.clientX, e.clientY, [
				{ text: 'Remove cell', callback: () => removeCell(cell) }
			]);
		};
	}

	function propagateCallback(cell: Cell) {
		return () => {
            for (const dep of cell.dependents) {
				if (dep.generate) dep.value = dep.generate();
            }
            cells = cells;
		};
	}

    // TODO: Value is wrong when backspacing a number entry.
</script>

<!-- FIXME: What ARIA role to use here? -->
<div class="workspace" on:contextmenu={showWorkspaceContextMenu}>
	{#each cells as cell}
		<div class="cell" on:contextmenu={cellContextMenuCallback(cell)}>
			<div class="header">
				<input id="id" type="text" size="8" bind:value={cell.name} />
				<div class="type">{typeof cell.value}</div>
			</div>
			{#if cell.generate}
				<div class="content">
					{cell.value}
				</div>
			{:else if typeof cell.value === 'number'}
				<input type="number" bind:value={cell.value} on:change={propagateCallback(cell)} />
			{/if}
		</div>
	{/each}
</div>

<style>
	div.workspace {
		padding: 0.5rem;
		border-bottom: 1px solid steelblue;
		width: 100%;
	}
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
