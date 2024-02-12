import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

type Level = "error" | "info";
type Message = { level: Level, text: string };

export const messages: Writable<Message[]> = writable([]);

export function displayInfo(text: string) {
    messages.update((ms) => [...ms, { level: "info", text: text }]);
}

export function displayError(text: string) {
    messages.update((ms) => [...ms, { level: "error", text: text }]);
}