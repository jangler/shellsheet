<script lang="ts">
	import ContextMenu from '$lib/ContextMenu.svelte';
	import Message, { messages } from '$lib/Message.svelte';
    import Workspace from '$lib/Workspace.svelte';
	import CommandPanel from '$lib/CommandPanel.svelte';
</script>

<h1>Shellsheet</h1>
<div class="flex-row">
	<Workspace />
	<CommandPanel />
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
	div.flex-row {
		display: flex;
		flex-direction: row;
		width: 100%;
	}
	div.messages {
		position: fixed;
		bottom: 0;
		right: 0;
	}
</style>
