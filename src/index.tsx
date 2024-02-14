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
	selected: boolean,
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

function Cell({ cell }) {
	return <div class={`cell ${cell.selected && 'selected'}`}
		onClick={cellClickHandler(cell)}>
		<div class="header">
			<input type="text" size={8} value={cell.name} />
			<div class="type">{typeof cell.value}</div>
		</div>
		<input type="number" value={cell.value} />
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

function addCell(cell) {
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