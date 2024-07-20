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
	import { getCookieValue } from '@/utils/getCookieValue';
	import { axiosClient } from '@/api/axiosClient';
	import { Colors } from '@/constants/Colors';

	import Button from '@/components/ui/Button.svelte';

	type timerProps = {
		workData: Work;
	};

	let { workData }: timerProps = $props();

	let remainingTime = $state('');
	let doneAt = $state(workData.done_at);
	let pauseAt = $state(workData.pause_at);

	let interval: NodeJS.Timeout;
	function intervalHandler(end: Date) {
		const diff = intervalToDuration({
			start: new Date(),
			end
		});

		remainingTime = formatDuration(diff, { zero: true, locale: ko });
	}

	if (!workData.is_pause) {
		interval = setInterval(() => {
			if (workData.done_at) {
				intervalHandler(new Date(workData.done_at));
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
		const token = getCookieValue('session');

		if (!token) {
			return;
		}

		try {
			const currentDateTime = new Date();

			const res: AxiosResponse<ResponseData<{ done_at: string }>> =
				await axiosClient.put(
					`/works/start/${workData.id}`,
					{
						start_at: currentDateTime.toISOString(),
						done_at: addMinutes(currentDateTime, workData.working_time)
					},
					{
						headers: {
							Authorization: token
						}
					}
				);

			const data = res.data;

			if (!data.done_at) {
				return;
			}

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
		const token = getCookieValue('session');

		if (!token) {
			return;
		}

		try {
			const currentDateTime = new Date();

			await axiosClient.put(
				`/works/pause/${workData.id}`,
				{
					pause_at: currentDateTime.toISOString()
				},
				{
					headers: {
						Authorization: token
					}
				}
			);

			pauseAt = currentDateTime.toISOString();
			clearInterval(interval);
		} catch (err) {
			console.log(err);
		}
	}

	async function workRestartHandler() {
		const token = getCookieValue('session');

		if (!token) {
			return;
		}

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
				await axiosClient.put(
					`/works/restart/${workData.id}`,
					{
						done_at: updatedDoneAt.toISOString()
					},
					{
						headers: {
							Authorization: token
						}
					}
				);
			const data = res.data;

			doneAt = data.done_at;
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

<div>
	<p class="mb-5">{remainingTime}</p>
	<div class="flex5">
		<Button clickHandler={workStartHandler}>일을 시작합시다</Button>
		<Button color={Colors.warning} clickHandler={workPauseHandler}>
			일을 멈춰요
		</Button>
		<Button color={Colors.secondary} clickHandler={workRestartHandler}>
			다시 시작하기
		</Button>
		<Button color={Colors.neutral}>재설정</Button>
	</div>
</div>
