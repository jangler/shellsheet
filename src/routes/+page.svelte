<script lang="ts">
	import Cell, { cells, firstFreeName } from '$lib/Cell.svelte';
	import ContextMenu, { showContextMenu } from '$lib/ContextMenu.svelte';
	import Message, { messages } from '$lib/Message.svelte';

	function showWorkspaceContextMenu(e: MouseEvent) {
		e.preventDefault();
		showContextMenu(e.clientX, e.clientY, [
			{ text: 'Add cell', callback: addCell },
			{ text: 'Clear workspace', callback: cells.clear }
		]);
	}

	function addCell() {
		cells.push({
			name: firstFreeName(),
			value: 0,
			editable: true
		});
	}
</script>

<h1>Shellsheet</h1>
<!-- FIXME: What ARIA role to use here? -->
<div class="workspace" on:contextmenu={showWorkspaceContextMenu}>
	{#each $cells as cell}
		<Cell {...cell} />
	{/each}
</div>
<div class="messages">
	{#each $messages as message}
		<Message {...message} />
	{/each}
</div>
<ContextMenu />

<style>
	h1 {
		background-color: lightsteelblue;
		margin: 0;
		padding: 0.5rem;
		text-align: center;
		border-bottom: 1px solid steelblue;
	}
	div.workspace {
		padding: 0.5rem;
		border-bottom: 1px solid steelblue;
	}
	div.messages {
		position: fixed;
		bottom: 0;
		right: 0;
	}
</style>
