<script lang="ts">
	import { onMount } from "svelte";

    export let x: number;
    export let y: number;
    export let items: { text: string, callback: () => any }[];

    let element: HTMLMenuElement;

    onMount(() => {
        element.style.left = `${x}px`;
        element.style.top = `${y - 16}px`;
    });
    
    // TODO: Add keyboard accelerators.
</script>

<style>
    menu {
        position: absolute;
        background-color: white;
        border: 1px solid black;
        border-radius: 2px;
        padding: 0;
        list-style: none;
    }
    menu li button {
        background-color: inherit;
        border: 0;
        border-radius: 0;
        text-align: left;
        padding: 0.4rem;
        width: 100%;
    }
    menu li button:hover {
        background-color: hsl(200, 80%, 95%);
    }
    menu li button:active {
        background-color: hsl(200, 90%, 90%);
    }
</style>

<menu bind:this={element}>
    {#each items as item}
    <li><button on:mouseup={item.callback}>{item.text}</button></li>
    {/each}
</menu>