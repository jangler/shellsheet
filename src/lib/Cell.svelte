<script lang="ts">
    export let id: string;
    export let value: any;
</script>

<style>
    div.cell {
        border: 1px solid gray;
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
        <input id="id" type="text" size="8" bind:value={id}/>
        <div class="type">{typeof value}</div>
    </div>
    <div class="content">
        {value}
    </div>
</div>