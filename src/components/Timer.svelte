<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { AxiosResponse } from 'axios';
	import { browser } from '$app/environment';
	import { addHours, differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns';
	import { ko } from 'date-fns/locale';

	import type { ResponseData } from '@/types/Response';
	import type { Work } from '@/types/Work';
	import { type TimerStore } from '@/lib/timer';
	import { getCookieValue } from '@/utils/getCookieValue';
	import { axiosClient } from '@/api/axiosClient';
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
		// TODO: try catch
		const token = getCookieValue('session');

		if (!token) {
			return;
		}

		const res: AxiosResponse<ResponseData<{ work: Work }>> = await axiosClient.post(
			'works/create',
			{
				start_at: new Date().toISOString(),
				// TODO: throw company name
				company_name: 'kfc'
			},
			{
				headers: {
					Authorization: token
				}
			}
		);

		const data = res.data;
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
		<Button isShow={$timerStore.workDoneAt === null} clickHandler={workStartHandler}>일을 시작합시다</Button>
		<Button
			isShow={!$timerStore.isPause && $timerStore.workDoneAt !== null}
			color={Colors.warning}
			clickHandler={pauseTimerHandler}
		>
			일을 멈춰요
		</Button>
		<Button
			isShow={$timerStore.isPause && $timerStore.workDoneAt !== null}
			color={Colors.secondary}
			clickHandler={restartTimerHandler}
		>
			다시 시작하기
		</Button>
		<Button isShow={$timerStore.workDoneAt !== null} color={Colors.neutral} clickHandler={resetTimerHandler}>
			재설정
		</Button>
	</div>
</div>
