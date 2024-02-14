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
	value: any,
	selected?: boolean,
	collapsed?: boolean,
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
		cell.name = (e.target as HTMLInputElement).value;
	}
}

function cellValueUpdateHandler(cell: Cell) {
	return (e: Event) => {
		const element = (e.target as HTMLInputElement);
		if (typeof cell.value == 'number') {
			cell.value = element.valueAsNumber;
		} else if (typeof cell.value == 'string') {
			cell.value = element.value;
		} else {
			error(`Update handler not implemented for ${typeof cell.value} type`);
		}
		info('Updated cell value');
	}
}

function Cell({ cell }) {
	return <div class={`cell ${cell.selected && 'selected'}`}
		onClick={cellClickHandler(cell)}>
		<div class="header">
			<button onClick={cellCollapseHandler(cell)}>
				{cell.collapsed ? '▷' : '▽'}
			</button>
			<input type="text" size={8} value={cell.name}
				onChange={cellNameUpdateHandler(cell)} />
			<span class="type">{typeof cell.value}</span>
		</div>
		{!cell.collapsed && (
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

function addCell(cell: Cell) {
	pushAction({
		do: () => {
			cells.push(cell);
			renderWorkspace();
		},
		undo: () => {
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
	let number = 1;
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
		<div class="flex-row" onKeyDown={keydown}>
			<div id="workspace" onClick={workspaceClick}></div>
			<div id="commands"></div>
		</div>
		<ul id="messages"></ul>
	</>, document.getElementById('app'))
	renderWorkspace();
	renderCommands();
	renderMessages();
}

renderApp();