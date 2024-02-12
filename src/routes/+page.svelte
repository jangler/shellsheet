<script lang="ts">
    import Cell from '$lib/Cell.svelte';
    import Message from '$lib/Message.svelte';
    import { cells } from '$lib/cells';
    import { messages } from '$lib/messages';

    function showContextMenu(e: MouseEvent) {
        e.preventDefault();
        const menu = document.querySelector('#contextMenu') as HTMLElement;
        console.log(menu);
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
        menu.classList.remove('hidden');
    }

    function hideContextMenu() {
        const menu = document.querySelector('#contextMenu') as HTMLElement;
        menu.classList.add('hidden');
    }

    function addCell() {
        cells.push({
            name: 'cell0',
            value: 0,
            editable: true,
        });
    }

    document.addEventListener('mouseup', hideContextMenu);
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
    #contextMenu {
        position: absolute;
        background-color: white;
        border: 1px solid black;
        border-radius: 2px;
        padding: 0;
        list-style: none;
    }
    #contextMenu li button {
        background-color: inherit;
        border: 0;
        border-radius: 0;
        text-align: left;
        padding: 0.4rem;
        width: 100%;
    }
    #contextMenu li button:hover {
        background-color: hsl(200, 80%, 95%);
    }
    #contextMenu li button:active {
        background-color: hsl(200, 90%, 90%);
    }
    .hidden {
        display: none;
    }
</style>

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
<!-- TODO: Accelerators! -->
<menu id="contextMenu" class="hidden">
    <li><button on:mouseup={addCell}>Add cell</button></li>
    <li><button on:mouseup={cells.clear}>Clear workspace</button></li>
</menu>