<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { AxiosResponse } from 'axios';
	import {
		addMinutes,
		addSeconds,
		formatDuration,
		intervalToDuration,
		differenceInSeconds
	} from 'date-fns';
	import { ko } from 'date-fns/locale';

	import type { ResponseData } from '@/types/ResponseData';
	import type { Work } from '@/types/Work';
	import { axiosClient } from '@/api/axiosClient';
	import { Colors } from '@/constants/Colors';

	import Button from '@/components/ui/Button.svelte';

	type timerProps = {
		workData: Work;
		refetchWorks: () => Promise<void>;
	};

	let { workData, refetchWorks }: timerProps = $props();

	let remainingTime = $state('');
	let doneAt = $state(workData.done_at);
	let pauseAt = $state(workData.pause_at);
	let isPause = $state(workData.is_pause);
	let isDonePending = $state(false);

	let interval: NodeJS.Timeout;
	async function intervalHandler(end: Date) {
		const now = new Date();

		if (now >= end && !isDonePending) {
			isDonePending = true;

			try {
				await axiosClient.put(`/works/done/${workData.id}`);
				await refetchWorks();
			} catch (err) {
				console.log(err);
			}

			clearInterval(interval);

			return;
		}

		const diff = intervalToDuration({
			start: new Date(),
			end
		});

		remainingTime = formatDuration(diff, { zero: true, locale: ko });
	}

	if (!workData.is_pause && !workData.is_done) {
		interval = setInterval(async () => {
			if (workData.done_at) {
				await intervalHandler(new Date(workData.done_at));
			} else {
				clearInterval(interval);
			}
		});
	}

	if (workData.done_at && workData.pause_at && workData.is_pause) {
		const diff = intervalToDuration({
			start: new Date(workData.pause_at),
			end: new Date(workData.done_at)
		});

		remainingTime = formatDuration(diff, { zero: true, locale: ko });
	}

	async function workStartHandler() {
		try {
			const currentDateTime = new Date();

			const res: AxiosResponse<ResponseData<{ done_at: string }>> =
				await axiosClient.put(`/works/start/${workData.id}`, {
					start_at: currentDateTime.toISOString(),
					done_at: addMinutes(currentDateTime, workData.working_time)
				});

			const data = res.data;

			if (!data.done_at) {
				return;
			}

			doneAt = data.done_at;
			interval = setInterval(() => {
				if (data.done_at) {
					intervalHandler(new Date(data.done_at));
				} else {
					clearInterval(interval);
				}
			});
		} catch (err) {
			console.log(err);
		}
	}

	async function workPauseHandler() {
		try {
			const currentDateTime = new Date();

			await axiosClient.put(`/works/pause/${workData.id}`, {
				pause_at: currentDateTime.toISOString()
			});

			pauseAt = currentDateTime.toISOString();
			isPause = true;
			clearInterval(interval);
		} catch (err) {
			console.log(err);
		}
	}

	async function workRestartHandler() {
		if (!pauseAt) {
			return;
		}

		if (!doneAt) {
			return;
		}

		try {
			const currentDate = new Date();
			const diff = differenceInSeconds(currentDate, new Date(pauseAt));
			const updatedDoneAt = addSeconds(new Date(doneAt), diff);

			const res: AxiosResponse<ResponseData<{ done_at: string }>> =
				await axiosClient.put(`/works/restart/${workData.id}`, {
					done_at: updatedDoneAt.toISOString()
				});
			const data = res.data;

			doneAt = data.done_at;
			isPause = false;
			interval = setInterval(() => {
				intervalHandler(new Date(data.done_at));
			});
		} catch (err) {
			console.log(err);
		}
	}

	onDestroy(() => {
		if (interval) {
			clearInterval(interval);
		}
	});
</script>

<div class="timer">
	<p class="mb-5">{remainingTime}</p>
	<div class="">
		{#if !doneAt}
			<Button clickHandler={workStartHandler}>일을 시작합시다</Button>
		{/if}
		{#if doneAt && !isPause}
			<Button color={Colors.warning} clickHandler={workPauseHandler}>
				일을 멈춰요
			</Button>
		{/if}
		{#if isPause}
			<Button color={Colors.secondary} clickHandler={workRestartHandler}>
				다시 시작하기
			</Button>
		{/if}
	</div>
</div>
