<script lang="ts">
	import { showContextMenu } from './ContextMenu.svelte';

	type Cell = { name: string; value: any; editable: boolean };
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

	function addCell() {
		cells = [
			...cells,
			{
				name: firstFreeName(),
				value: 0,
				editable: true
			}
		];
	}

	function showWorkspaceContextMenu(e: MouseEvent) {
		e.preventDefault();
		showContextMenu(e.clientX, e.clientY, [
			{ text: 'Add cell', callback: addCell },
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
</script>

<!-- FIXME: What ARIA role to use here? -->
<div class="workspace" on:contextmenu={showWorkspaceContextMenu}>
	{#each cells as cell}
		<div class="cell" on:contextmenu={cellContextMenuCallback(cell)}>
			<div class="header">
				<input id="id" type="text" size="8" bind:value={cell.name} />
				<div class="type">{typeof cell.value}</div>
			</div>
			{#if cell.editable}
				{#if typeof cell.value === 'number'}
					<input type="number" bind:value={cell.value} />
				{/if}
			{:else}
				<div class="content">
					{cell.value}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	div.workspace {
		padding: 0.5rem;
		border-bottom: 1px solid steelblue;
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
