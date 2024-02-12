<script lang="ts">
	import { onMount } from "svelte";
    import { cells } from '$lib/state';
    import { displayInfo, displayError } from "./messages";

    export let id: string;
    export let value: any;

    let element: HTMLElement | undefined;

    onMount(() => {
        cells.set(id, element!);
    });

    function updateId(e: Event) {
        let target = e.target as HTMLInputElement;
        let key = target.value;
        if (key === id) return;
        if (cells.has(key)) {
            displayError(`Cell '${key}' already exists`);
            target.value = id;
        } else {
            displayInfo(`Cell '${id}' updated to '${key}'`);
            cells.set(key, element!);
            cells.delete(id);
            id = key;
        }
        console.log(cells);
    }
</script>

<style>
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

<div class="cell" bind:this={element}>
    <div class="header">
        <input id="id" type="text" size="8" value={id} on:change={updateId} on:focusout={updateId}/>
        <div class="type">{typeof value}</div>
    </div>
    <div class="content">
        {value}
    </div>
</div>