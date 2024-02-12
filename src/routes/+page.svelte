<script lang="ts">
	import { cells, firstFreeName } from '$lib/Cell.svelte';
	import ContextMenu from '$lib/ContextMenu.svelte';
	import Message, { messages } from '$lib/Message.svelte';
    import Workspace from '$lib/Workspace.svelte';
</script>

<h1>Shellsheet</h1>
<Workspace />
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
	div.messages {
		position: fixed;
		bottom: 0;
		right: 0;
	}
</style>
