import { writable } from 'svelte/store';

export const profileBackgroundColor = writable<string | null>(null);
export const profileTextColor = writable<string | null>(null);
