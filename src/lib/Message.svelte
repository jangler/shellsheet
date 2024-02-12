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