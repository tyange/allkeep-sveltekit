import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createCounter(key: string, initialValue: number) {
	const storedValue = (browser && localStorage.getItem(key)) || 0;
	const value = storedValue ? JSON.parse(storedValue) : initialValue;

	const { subscribe, set, update } = writable(value);

	function increment() {
		update((count) => count + 1);
	}

	function decrement() {
		update((count) => count - 1);
	}

	function reset() {
		set(0);
	}

	return { subscribe, increment, decrement, reset };
}

export const counter = createCounter('count', 0);

counter.subscribe((value) => {
	if (browser) {
		localStorage.setItem('count', JSON.stringify(value));
	}
});
