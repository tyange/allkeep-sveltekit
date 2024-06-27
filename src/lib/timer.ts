import { writable, type Invalidator, type Subscriber, type Unsubscriber } from 'svelte/store';
import { browser } from '$app/environment';
import { addSeconds } from 'date-fns';

const INITIAL_REMAINING_TIME_STRING = '9시간 00분 00초';

const initialState = {
	isPause: false,
	workDoneAt: null,
	workPauseAt: null,
	remainingTimeString: INITIAL_REMAINING_TIME_STRING
};

export type TimerStore = {
	subscribe: (
		this: void,
		run: Subscriber<{
			isPause: boolean;
			workDoneAt: Date | null;
			workPauseAt: Date | null;
			remainingTimeString: string;
		}>,
		invalidate?:
			| Invalidator<{
					isPause: boolean;
					workDoneAt: Date | null;
					workPauseAt: Date | null;
					remainingTimeString: string;
			  }>
			| undefined
	) => Unsubscriber;
	pauseTimer: () => void;
	restartTimer: () => void;
	setWorkDoneAt: (startAt: Date) => void;
	addWorkDoneAt: (diffTime: number) => void;
	setWorkPauseAt: (pauseAt: Date) => void;
	setRemainingTimeString: (timeString: string) => void;
	reset: () => void;
};

export function createTimerStore(key: string): TimerStore {
	const storedValue = (browser && localStorage.getItem(key)) || JSON.stringify(initialState);
	const value = JSON.parse(storedValue);

	const { subscribe, set, update } = writable<{
		isPause: boolean;
		workDoneAt: Date | null;
		workPauseAt: Date | null;
		remainingTimeString: string;
	}>(value);

	function pauseTimer() {
		update((prevTimer) => ({ ...prevTimer, isPause: true }));
	}

	function restartTimer() {
		update((prevTimer) => ({ ...prevTimer, isPause: false }));
	}

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

	return {
		subscribe,
		pauseTimer,
		restartTimer,
		setWorkDoneAt,
		addWorkDoneAt,
		setWorkPauseAt,
		setRemainingTimeString,
		reset
	};
}
