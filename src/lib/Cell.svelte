<script lang="ts" context="module">
    import { writable } from 'svelte/store';

    type Cell = { name: string, value: any, editable: boolean };

    const { subscribe, set, update } = writable([] as Cell[]);

    export const cells = {
        subscribe: subscribe,
        clear: () => set([]),
        push: (cell: Cell) => update((cs) => [...cs, cell]),
    }

    let cellNames = new Set();
    cells.subscribe((cs) => {
        cellNames.clear();
        for (const cell of cs) {
            cellNames.add(cell.name);
        }
    });

    export function firstFreeName() {
        let i = 1;
        while (true) {
            let name = `#${i}`;
            if (!cellNames.has(name)) return name;
            i++;
        }
    }
</script>

<script lang="ts">
	// import { onMount } from "svelte";
    // import { cells } from '$lib/state';
    import { messages } from "./messages";
	import { tick } from 'svelte';

    // type fn = () => any;

    export let name: string;
    export let value: any;
    export let editable = true;

    // export let genfn: fn | undefined = undefined;
    // export let depends: string[] = [];

    // let element: HTMLElement | undefined;
    // let previousValue: any;
    // let whenUpdated: fn[] = [];

    // function setState() {
    //     cells.set(id, { element: element!, value: value, genfn: genfn });
    // }

    // // FIXME: The dependency stuff is wrong (I think it's trying to flow in
    // //        the wrong direction), and I think the kind of approach I'm
    // //        taking is wrong too. I shouldn't be duplicating state like this;
    // //        either I need to make Workspace into a component(?) and have
    // //        updates propogate via bindings (or store subscriptions?) or just
    // //        use vanilla TS with JSX.

    // onMount(() => {
    //     if (genfn) value = genfn();
    //     setState();
    //     for (const dep of depends) {
    //         const f = cells.get(dep).genfn;
    //         if (f) whenUpdated.push(f);
    //     }
    // });

    function updateId(e: Event) {
        let target = e.target as HTMLInputElement;
        let key = target.value;
        if (key === name) return;
        if (cellNames.has(key)) {
            messages.postError(`Cell '${key}' already exists`);
            target.value = name;
        } else {
            // FIXME: This doesn't propogate to the original cell object.
            messages.postInfo(`Cell '${name}' updated to '${key}'`);
            name = key;
        }
        tick().then(() => {
            console.log(cellNames);
        });
    }

    function handleUpdateValue() {
    //     console.log(previousValue, value);
    //     if (previousValue !== undefined && previousValue !== value) {
    //         displayInfo(`${id}: ${previousValue} changed to ${value}`);
    //         previousValue = value;
    //         for (f of whenUpdated) f();
    //     }
    //     setState();
    }

    // $: handleUpdateValue();
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

<div class="cell">
    <div class="header">
        <input id="id" type="text" size="8" value={name} on:change={updateId} on:focusout={updateId}/>
        <div class="type">{typeof value}</div>
    </div>
    {#if editable}
    {#if typeof value === 'number'}
    <input type="number" value={value} on:change={handleUpdateValue} on:focusout={handleUpdateValue}/>
    {/if}
    {:else}
    <div class="content">
        {value}
    </div>
    {/if}
</div>