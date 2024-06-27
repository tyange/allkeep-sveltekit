<script lang="ts">
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { addHours, differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns';
	import { ko } from 'date-fns/locale';

	import { createTimerStore, type TimerStore } from '@/lib/timer';
	import { axiosClient } from '@/api/axiosClient';
	import { getCookieValue } from '@/utils/getCookieValue';
	import { Colors } from '@/constants/Colors';

	import Button from '@/components/ui/Button.svelte';

	type timerProps = {
		name: string;
		timerStore: TimerStore;
	};

	let { name, timerStore }: timerProps = $props();

	timerStore.subscribe((value) => {
		if (browser) {
			localStorage.setItem(name, JSON.stringify(value));
		}
	});

	let interval: NodeJS.Timeout;
	function intervalHandler() {
		if (!$timerStore.workDoneAt) {
			return;
		}

		const diff = intervalToDuration({ start: new Date(), end: $timerStore.workDoneAt });
		timerStore.setRemainingTimeString(formatDuration(diff, { zero: true, locale: ko }));
	}

	if ($timerStore.workDoneAt && !$timerStore.isPause) {
		interval = setInterval(intervalHandler, 100);
	}

	async function workStartHandler() {
		const session = getCookieValue('session');
		const headers = session ? { Authorization: session } : undefined;

		const res = await axiosClient.post(
			'work/create',
			{
				start_at: new Date().toISOString(),
				company_name: 'kfc'
			},
			{ headers }
		);

		const data = await res.data;
		const startAt = data.work['start_at'];

		timerStore.setWorkDoneAt(addHours(new Date(startAt), 9));

		interval = setInterval(intervalHandler, 100);
	}

	function pauseTimerHandler() {
		timerStore.pauseTimer();
		timerStore.setWorkPauseAt(new Date());
		clearInterval(interval);
	}

	function restartTimerHandler() {
		if (!$timerStore.workPauseAt) {
			return;
		}

		const diffTime = differenceInSeconds(new Date(), $timerStore.workPauseAt);
		timerStore.addWorkDoneAt(diffTime);
		interval = setInterval(intervalHandler, 100);
		timerStore.restartTimer();
	}

	function resetTimerHandler() {
		timerStore.reset();
		clearInterval(interval);
	}

	onDestroy(() => {
		if (interval) {
			clearInterval(interval);
		}
	});
</script>

<div>
	<p class="mb-5">{$timerStore.remainingTimeString}</p>
	<div class="flex gap-5">
		<Button
			isShow={$timerStore.workDoneAt === null}
			label="일을 시작합시다"
			clickHandler={workStartHandler}
		/>
		<Button
			isShow={!$timerStore.isPause && $timerStore.workDoneAt !== null}
			label="일을 멈춰요"
			color={Colors.warning}
			clickHandler={pauseTimerHandler}
		/>
		<Button
			isShow={$timerStore.isPause && $timerStore.workDoneAt !== null}
			label="다시 시작하기"
			color={Colors.secondary}
			clickHandler={restartTimerHandler}
		/>
		<Button
			isShow={$timerStore.workDoneAt !== null}
			label="재설정"
			color={Colors.neutral}
			clickHandler={resetTimerHandler}
		/>
	</div>
</div>
