<script lang="ts">
    import CommandMenu from "./CommandMenu.svelte";
    import type { Command } from "./CommandMenu.svelte";

	let commands: Command[] = [
		{
			label: 'Cells',
			submenu: [{ label: 'Delete' }, { label: 'Rename' }]
		}
	];
    let activeCommands = commands;

    function updateSearch(e: Event) {
        const searchString = (e.target as HTMLInputElement).value.toLowerCase();
        activeCommands = filterCommands(commands, searchString);
    }

    function filterCommands(cmds: Command[], searchString: string) {
        let cs: Command[] = [];
        for (const c of cmds) {
            if (c.label.toLowerCase().includes(searchString)) {
                cs.push(c);
            } else if (c.submenu) {
                const children = filterCommands(c.submenu, searchString);
                if (children.length > 0) {
                    cs.push({
                        label: c.label,
                        submenu: children,
                    });
                }
            }
        }
        return cs;
    }
</script>

<div class="panel">
	<h2>Commands</h2>
	<input type="search" placeholder="Search" on:input={updateSearch}/>
    <CommandMenu commands={activeCommands}/>
</div>

<style>
	div.panel {
		min-width: 15rem;
		border-left: 1px solid steelblue;
		border-bottom: 1px solid steelblue;
	}
	h2 {
		text-align: center;
		border-bottom: 1px solid lightgray;
		margin: 0;
	}
	input[type='search'] {
		width: 100%;
	}
</style>
