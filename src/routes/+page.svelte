<script lang="ts">
    import Cell from '$lib/Cell.svelte';
    import Message from '$lib/Message.svelte';
    import { cells } from '$lib/state';
    import { messages } from '$lib/messages';

    let values = [1, 2, 3, 4];
    cells.clear();
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
    }
    div.messages {
        position: fixed;
        bottom: 0;
        right: 0;
    }
</style>

<h1>Shellsheet</h1>
<div class="workspace">
    {#each values as value, i}
    <Cell id={i.toString()} {value}/>
    {/each}
    <div class="messages">
        {#each $messages as msg}
        <Message level={msg.level} text={msg.text}/> 
        {/each}
    </div>
</div>