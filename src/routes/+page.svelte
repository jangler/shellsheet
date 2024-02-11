<script lang="ts">
    import Cell from '$lib/Cell.svelte';
    let values = [1, 2, 3];
</script>

<h1>Shellsheet</h1>
{#each values as value}
<Cell {value}/>
{/each}