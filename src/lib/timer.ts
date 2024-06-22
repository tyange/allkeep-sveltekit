import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { addSeconds } from 'date-fns';

const INITIAL_REMAINING_TIME_STRING = '9시간 00분 00초';

const initialState = {
	workDoneAt: null,
	workPauseAt: null,
	remainingTimeString: INITIAL_REMAINING_TIME_STRING
};

function createTimerStore(key: string) {
	const storedValue = (browser && localStorage.getItem(key)) || JSON.stringify(initialState);
	const value = JSON.parse(storedValue);

	const { subscribe, set, update } = writable<{
		workDoneAt: Date | null;
		workPauseAt: Date | null;
		remainingTimeString: string;
	}>(value);

	function setWorkDoneAt(startAt: Date) {
		update((prevTimer) => ({ ...prevTimer, workDoneAt: startAt }));
	}

	function addWorkDoneAt(diffTime: number) {
		update((prevTimer) => {
			const prevWorkDoneAt = prevTimer.workDoneAt;

			if (!prevWorkDoneAt) {
				return prevTimer;
			}

			return { ...prevTimer, workDoneAt: addSeconds(prevWorkDoneAt, diffTime) };
		});
	}

	function setWorkPauseAt(pauseAt: Date) {
		update((prevTimer) => ({ ...prevTimer, workPauseAt: pauseAt }));
	}

	function setRemainingTimeString(timeString: string) {
		update((prevTimer) => ({ ...prevTimer, remainingTimeString: timeString }));
	}

	function reset() {
		set({ ...initialState });
	}

	return { subscribe, setWorkDoneAt, addWorkDoneAt, setWorkPauseAt, setRemainingTimeString, reset };
}

export const timer = createTimerStore('timer');

timer.subscribe((value) => {
	if (browser) {
		localStorage.setItem('timer', JSON.stringify(value));
	}
});
