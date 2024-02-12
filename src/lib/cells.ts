import { writable } from 'svelte/store';

type Cell = { name: string, value: any, editable: boolean };

const { subscribe, set, update } = writable([] as Cell[]);

export const cells = {
    subscribe: subscribe,
    clear: () => set([]),
    push: (cell: Cell) => update((cs) => [...cs, cell]),
}