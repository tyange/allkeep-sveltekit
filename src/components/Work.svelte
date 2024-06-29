<script lang="ts">
	import { browser } from '$app/environment';

	import { createTimerStore } from '@/lib/timer';

	import Box from '@/components/ui/Box.svelte';
	import CompanyForm from '@/components/CompanyForm.svelte';
	import Timer from '@/components/Timer.svelte';

	type WorkProps = {
		name: string;
	};

	let { name }: WorkProps = $props();

	const timerStore = createTimerStore(name);

	let isShowTimer = $state(browser && !!localStorage.getItem(name));

	function showTimerHandler() {
		isShowTimer = true;
	}
</script>

<div>
	<Box>
		<div class="flex flex-col">
			{#if isShowTimer}
				<Timer {name} {timerStore} />
			{:else}
				<CompanyForm {showTimerHandler} />
			{/if}
		</div>
	</Box>
</div>
