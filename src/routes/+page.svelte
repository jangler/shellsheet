<script lang="ts">
    import Cell from '$lib/Cell.svelte';
    let values = [1, 2, 3];
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
</style>

<h1>Shellsheet</h1>
<div class="workspace">
    {#each values as value, i}
    <Cell id={i.toString()} {value}/>
    {/each}
</div>