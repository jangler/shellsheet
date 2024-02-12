<script lang="ts">
    import Cell from '$lib/Cell.svelte';
	import ContextMenu from '$lib/ContextMenu.svelte';
    import Message from '$lib/Message.svelte';
    import { cells } from '$lib/cells';
    import { messages } from '$lib/messages';

    let menuVisible = false;
    let menuX: number;
    let menuY: number;

    function showContextMenu(e: MouseEvent) {
        e.preventDefault();
        menuX = e.clientX;
        menuY = e.clientY;
        menuVisible = true;
    }

    function addCell() {
        cells.push({
            name: 'cell0',
            value: 0,
            editable: true,
        });
    }

    let menuItems = [
        { text: "Add cell", callback: addCell },
        { text: "Clear workspace", callback: cells.clear },
    ];
</script>

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

<svelte:document on:mouseup={() => menuVisible = false}/>

<h1>Shellsheet</h1>
<!-- FIXME: What ARIA role to use here? -->
<div class="workspace" on:contextmenu={showContextMenu}>
    {#each $cells as cell}
    <Cell {...cell}/>
    {/each}
</div>
<div class="messages">
    {#each $messages as message}
    <Message {...message}/>
    {/each}
</div>
{#if menuVisible}
<ContextMenu x={menuX} y={menuY} items={menuItems}/>
{/if}