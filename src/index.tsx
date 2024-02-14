import { render } from 'preact';
import { useState } from 'preact/hooks';

import { renderMessages, info, error } from './messages';
import { pushAction, undo, redo } from './undo';

import './normalize.css';
import './style.css';

function CommandCat({ label, commands }) {
	const [collapsed, setCollapsed] = useState(true);

	function toggleCollapsed() {
		setCollapsed(!collapsed);
	}

	return <menu>
		<button onClick={toggleCollapsed}>
			{collapsed ? '▷' : '▽'} {label}
		</button>
		{collapsed ? [] : commands.map(cmd => (
			<li><button onClick={cmd.callback}>{cmd.label}</button></li>
		))}
	</menu>;
}

function CommandPane({ cats }) {
	return <>
		<h2>Commands</h2>
		<input type="search" placeholder="Search" />
		{cats.map(cat => (
			<CommandCat label={cat.label} commands={cat.commands} />
		))}
	</>;
}

type Cell = {
	name: string,
	value?: any,
	regen?: () => any,
	selected?: boolean,
	collapsed?: boolean,
	dependents?: Cell[],
};

let cells: Cell[] = [];

function cellClickHandler(cell: Cell) {
	return (e: MouseEvent) => {
		e.stopPropagation();
		if (e.altKey) {
			cell.selected = !cell.selected;
		} else if (e.ctrlKey || e.shiftKey) {
			cell.selected = true;
		} else {
			for (const c of cells) c.selected = false;
			cell.selected = true;
		}
		renderWorkspace();
	};
}

function cellCollapseHandler(cell: Cell) {
	return (e: MouseEvent) => {
		cell.collapsed = !cell.collapsed;
		renderWorkspace();
		e.stopPropagation();
	};
}

function cellNameUpdateHandler(cell: Cell) {
	return (e: Event) => {
		const oldName = cell.name;
		const newName = (e.target as HTMLInputElement).value;
		pushAction({
			label: 'cell name change',
			do: () => {
				cell.name = newName;
				renderWorkspace();
			},
			undo: () => {
				cell.name = oldName;
				renderWorkspace();
			},
		});
	}
}

function updateCellValue(cell: Cell, newValue: any) {
	const oldValue = cell.value;
	pushAction({
		label: 'update cell value',
		do: () => {
			cell.value = newValue;
			for (const c of cell.dependents) {
				c.value = c.regen();
			}
			renderWorkspace();
		},
		undo: () => {
			cell.value = oldValue;
			for (const c of cell.dependents) {
				c.value = c.regen();
			}
			renderWorkspace();
		},
	})
}

function cellValueUpdateHandler(cell: Cell) {
	return (e: Event) => {
		const type = typeof cell.value;
		const element = (e.target as HTMLInputElement);
		let newValue;
		if (type == 'number') {
			newValue = element.valueAsNumber;
		} else if (type == 'string') {
			newValue = element.value;
		} else {
			error(`Update handler not implemented for ${type} type`);
			return;
		}
		updateCellValue(cell, newValue);
	}
}

function Cell({ cell }) {
	return <div class={`cell${cell.selected ? ' selected' : ''}`}
		onClick={cellClickHandler(cell)}>
		<div class="header">
			<button onClick={cellCollapseHandler(cell)}>
				{cell.collapsed ? '▷' : '▽'}
			</button>
			<input type="text" size={24} value={cell.name}
				onChange={cellNameUpdateHandler(cell)} />
			<span class="type">{typeof cell.value}</span>
		</div>
		{!cell.collapsed && (cell.regen ?
			<div class="value">{cell.value}</div> :
			<input type="number" size={8} value={cell.value}
				onChange={cellValueUpdateHandler(cell)} />
		)}
	</div>;
}

function Workspace({ cells }) {
	return <>
		{cells.map(cell => (
			<Cell cell={cell} />
		))}
	</>;
}

function renderWorkspace() {
	render(<Workspace cells={cells} />, document.getElementById('workspace'));
}

function addCell(cell: Cell, dependsOn?: Cell[]) {
	cell.dependents = [];
	if (cell.regen) cell.value = cell.regen();
	pushAction({
		label: 'cell insertion',
		do: () => {
			if (dependsOn) {
				for (const c of dependsOn) c.dependents.push(cell);
			}
			cells.push(cell);
			renderWorkspace();
		},
		undo: () => {
			if (dependsOn) {
				for (const c of dependsOn) {
					c.dependents = c.dependents.filter(c2 => c2 !== c);
				}
			}
			cells.pop();
			renderWorkspace();
		},
	});
}

function deleteSelectedCells() {
	const deletions = [];
	cells.map((cell, index) => {
		if (cell.selected) {
			deletions.push({ index, cell });
		}
	});
	if (deletions.length == 0) return;
	pushAction({
		label: 'cell deletion',
		do: () => {
			const indices = deletions.map(({ index }) => index);
			cells = cells.filter((_, i) => !indices.includes(i));
			renderWorkspace();
		},
		undo: () => {
			for (const { index, cell } of deletions) {
				cells.splice(index, 0, cell);
			}
			renderWorkspace();
		},
	});
}

function cellNameWithPrefix(prefix: string) {
	const cellNames = new Set(cells.map(c => c.name));
	if (!cellNames.has(prefix)) return prefix;
	let number = 2;
	while (cellNames.has(`${prefix} ${number}`)) {
		number++;
	}
	return `${prefix} ${number}`;
}

function addNumberCell() {
	addCell({
		name: cellNameWithPrefix('Number'),
		value: 0,
	});
}

function addSumCell() {
	const selection = cells.filter(c => c.selected);
	const fn = () => {
		let sum = 0;
		for (const c of selection) sum += c.value;
		return sum;
	}
	addCell({
		name: cellNameWithPrefix(`Sum of ${selection.map(c => c.name).join(', ')}`),
		regen: fn,
	}, selection);
}

const commandCats = [
	{
		label: "Cells", commands: [
			{ label: "Delete", callback: deleteSelectedCells },
		]
	},
	{
		label: "Literals", commands: [
			{ label: "Number", callback: addNumberCell },
		]
	},
	{
		label: "Math", commands: [
			{ label: "Sum", callback: addSumCell }
		]
	},
];

function renderCommands() {
	render(<CommandPane cats={commandCats} />, document.getElementById('commands'));
}

function keydown(e: KeyboardEvent) {
	if (e.ctrlKey) {
		if (e.code == 'KeyZ') {
			undo();
		} else if (e.code == 'KeyY') {
			redo();
		}
	}
}

function workspaceClick() {
	cells.map(c => c.selected = false);
	renderWorkspace();
}

function renderApp() {
	render(<>
		<h1>Shellsheet</h1>
		<div class="flex-row">
			<div id="workspace" onClick={workspaceClick}></div>
			<div id="commands"></div>
		</div>
		<ul id="messages"></ul>
	</>, document.getElementById('app'))
	renderWorkspace();
	renderCommands();
	renderMessages();
}

// FIXME: Use Preact's component lifecycle functions to remove this when Vite
// refreshes things.
document.addEventListener('keydown', keydown);

renderApp();