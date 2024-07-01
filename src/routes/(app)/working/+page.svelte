<script lang="ts">
	import { onMount } from 'svelte';
	import type { AxiosResponse } from 'axios';

	import type { ResponseData } from '@/types/ResponseData';
	import type { Work } from '@/types/Work';
	import { axiosClient } from '@/api/axiosClient';
	import { getCookieValue } from '@/utils/getCookieValue';

	import WorkComponent from '@/components/WorkComponent.svelte';
	import CompanyForm from '@/components/CompanyForm.svelte';

	let works: Work[] = $state([]);

	const fetchWorks = async () => {
		try {
			const token = getCookieValue('session');

			if (!token) {
				return;
			}

			const res: AxiosResponse<ResponseData<{ works: Work[] }>> = await axiosClient('/works/all', {
				headers: { Authorization: token }
			});

			works = res.data.works ?? [];
		} catch (err) {
			console.error(err);
		}
	};

	onMount(() => {
		fetchWorks();
	});
</script>

<div class="flex w-full flex-1 items-center justify-center">
	<div class="w-1/2">
		{#if works.length > 0}
			{#each works as work}
				<WorkComponent name={String(work.id)} />
			{/each}
		{/if}
		{#if works.length < 5}
			<div>일 추가</div>
		{/if}
	</div>
</div>
