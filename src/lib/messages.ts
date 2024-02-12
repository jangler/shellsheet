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