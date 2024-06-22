<script lang="ts">
	import { onDestroy } from 'svelte';
	import { addHours, differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns';
	import { ko } from 'date-fns/locale';
	import axios from 'axios';

	import { timer } from '@/lib/timer';

	import Button from '@/components/ui/Button.svelte';
	import { Colors } from '@/constants/Colors';

	let interval: NodeJS.Timeout;
	function intervalHandler() {
		if (!$timer.workDoneAt) {
			return;
		}

		const diff = intervalToDuration({ start: new Date(), end: $timer.workDoneAt });
		timer.setRemainingTimeString(formatDuration(diff, { zero: true, locale: ko }));
	}

	if ($timer.workDoneAt && !$timer.isPause) {
		interval = setInterval(intervalHandler, 100);
	}

	async function workStartHandler() {
		const res = await axios.post(
			'http://localhost:8080/work/create',
			{
				start_at: new Date().toISOString(),
				company_name: 'kfc'
			},
			{
				headers: {
					Authorization:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJleHAiOjE3MTkwNTcyOTEsInVzZXJJZCI6Mn0.E82hdp1g7Zt3PvDx1fWkbUtoCzRQzk2VYWQmPHm1dsk'
				}
			}
		);

		const data = await res.data;
		const startAt = data.work['start_at'];

		timer.setWorkDoneAt(addHours(new Date(startAt), 9));

		interval = setInterval(intervalHandler, 100);
	}

	function timerPauseHandler() {
		timer.pauseTimer();
		timer.setWorkPauseAt(new Date());
		clearInterval(interval);
	}

	function timerRestartHandler() {
		if (!$timer.workPauseAt) {
			return;
		}

		const diffTime = differenceInSeconds(new Date(), $timer.workPauseAt);
		timer.addWorkDoneAt(diffTime);
		interval = setInterval(intervalHandler, 100);
		timer.restartTimer();
	}

	// TODO: resetHandler 추가하기

	onDestroy(() => {
		if (interval) {
			clearInterval(interval);
		}
	});
</script>

<div>
	<p class="mb-5">{$timer.remainingTimeString}</p>
	<div class="flex gap-5">
		<Button
			isShow={$timer.workDoneAt === null}
			label="일을 시작합시다"
			clickHandler={workStartHandler}
		/>
		<Button
			isShow={!$timer.isPause}
			label="일을 멈춰요"
			color={Colors.warning}
			clickHandler={timerPauseHandler}
		/>
		<Button
			isShow={$timer.isPause}
			label="다시 시작하기"
			color={Colors.secondary}
			clickHandler={timerRestartHandler}
		/>
	</div>
</div>
