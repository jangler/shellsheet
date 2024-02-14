import { render } from 'preact';
import { useState } from 'preact/hooks';

import { renderMessages, info, error } from './messages';

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
	info(`Added cell '${cell.name}'`);
	cells.push(cell);
	renderWorkspace();
}

function deleteSelectedCells() {
	cells = cells.filter(c => !c.selected);
	renderWorkspace();
}

const commandCats = [
	{
		label: "Cells", commands: [
			{ label: "Delete", callback: deleteSelectedCells },
		]
	},
	{
		label: "Literals", commands: [
			{
				label: "Number", callback: () => addCell({
					name: "Cell",
					value: 0,
				})
			},
		]
	},
];

function renderCommands() {
	render(<CommandPane cats={commandCats} />, document.getElementById('commands'));
}

renderWorkspace();
renderCommands();
renderMessages();