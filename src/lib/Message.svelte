<script lang="ts" context="module">
    import { writable } from 'svelte/store';

    type Level = "error" | "info";
    type Message = { level: Level, text: string };

    const { subscribe, update } = writable([] as Message[]);

    export const messages = {
        subscribe: subscribe,
        postInfo: (s: string) => {
            update((ms) => [...ms, { level: "info", text: s }]);
        },
        postError: (s: string) => {
            update((ms) => [...ms, { level: "error", text: s }]);
        },
    }
</script>

<script lang="ts">
    // TODO: Messages should expire after some time.
    // TODO: Should messages also expire when clicked?
    export let level: "info" | "error";
    export let text: string;
</script>

<style>
    div {
        border: 1px solid lightgray;
        background-color: white;
        border-radius: 2px;
        margin: 1rem;
        padding: 0.5rem;
    }
    div.info {
        color: black;
    }
    div.error {
        color: red;
    }
</style>

<div class={level}>{text}</div>