<script lang="ts" context="module">
	export type Command = {
		label: string;
		submenu?: Command[];
		run?: () => void;
	};
</script>

<script lang="ts">
    export let commands: Command[];
</script>

<menu>
    {#each commands as command}
        {#if command.submenu}
            <li>
                {command.label}
                <svelte:self commands={command.submenu}/>
            </li>
        {:else}
            <li><button>{command.label}</button></li>
        {/if}
    {/each}
</menu>

<style>
    menu {
        padding: 0;
    }
    li {
        list-style: none;
        margin: 0.5rem;
    }
    button {
        border: 1px solid lightgray;
        border-radius: 2px;
    }
</style>