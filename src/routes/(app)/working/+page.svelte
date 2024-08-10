<script lang="ts">
	import { onMount } from 'svelte';
	import type { AxiosResponse } from 'axios';

	import type { ResponseData } from '@/types/ResponseData';
	import type { Work } from '@/types/Work';
	import type { Company } from '@/types/Company';
	import { Suitability } from '@/constants/Suitability';
	import { Sizes } from '@/constants/Sizes';
	import { axiosClient } from '@/api/axiosClient';
	import { getCookieValue } from '@/utils/getCookieValue';
	import { createNumberArray } from '@/utils/createNumberArray';

	import Box from '@/components/ui/Box.svelte';
	import Button from '@/components/ui/Button.svelte';
	import Timer from '@/components/Timer.svelte';

	const MAX_WORKING_HOURS = 13;

	let works: Work[] = $state([]);
	let companies: Company[] = $state([]);
	let isManualInput = $state(false);
	let workspace: Company | null = $state(null);
	let rangedWorkingHours = $state(1);
	let enteredWorkingHours = $state(0);
	let enteredWorkingMinutes = $state(0);

	const fetchIncompleteWorks = async () => {
		try {
			const res: AxiosResponse<ResponseData<{ works: Work[] }>> =
				await axiosClient('/works/all-incomplete');

			works = res.data.works ?? [];
		} catch (err) {
			console.error(err);
		}
	};

	const fetchAllCompanies = async () => {
		try {
			const res: AxiosResponse<ResponseData<{ companies: Company[] }>> =
				await axiosClient('/companies/all-at-once');

			const data = res.data;

			if (!data.companies) {
				companies = [];
				workspace = null;
				return;
			}

			companies = data.companies;
			workspace = data.companies[0];
		} catch (err) {
			console.error(err);
		}
	};

	const toggleManualInput = () => {
		isManualInput = !isManualInput;
	};

	const createWork = async () => {
		try {
			if (!workspace) {
				return;
			}

			let workingHours = 0;
			if (isManualInput) {
				workingHours = enteredWorkingHours * 60 + enteredWorkingMinutes;
			} else {
				workingHours = rangedWorkingHours * 60;
			}

			await axiosClient.post('/works/create', {
				company_id: workspace.id,
				company_name: workspace.company_name,
				working_time: workingHours
			});
		} catch (err) {
			console.error(err);
		}
	};

	onMount(() => {
		fetchIncompleteWorks();
		fetchAllCompanies();
	});
</script>

<div class="flex w-full flex-1 flex-col items-center justify-center gap-10">
	<div class="relative h-96 w-2/3">
		<Box suitability={Suitability.full}>
			<div
				class="relative flex h-full w-full flex-col items-center justify-center"
			>
				<form id="workForm" class="flex h-full w-full flex-col gap-10">
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text text-gray-700">일하는 곳</span>
						</div>
						<select class="select bg-white" bind:value={workspace}>
							{#each companies as company}
								<option value={company}>
									{company.company_name}
								</option>
							{/each}
						</select>
					</label>
					<label class="form-control">
						<div class="label">
							<span class="label-text text-gray-700">몇 시간 일을 하나요?</span>
						</div>
						{#if !isManualInput}
							<input
								type="range"
								min="0"
								max={MAX_WORKING_HOURS}
								bind:value={rangedWorkingHours}
								class="range"
								step="1"
							/>
							<div class="flex w-full justify-between py-1 text-xs">
								{#each createNumberArray(MAX_WORKING_HOURS) as hour}
									<span>{hour}</span>
								{/each}
							</div>
							<div class="label">
								<span class="label-text-alt"></span>
								<span class="label-text-alt text-gray-700">
									<button onclick={toggleManualInput}>
										아니면 직접 입력 <i class="fa-solid fa-arrow-right"></i>
									</button>
								</span>
							</div>
						{:else}
							<label class="relative flex">
								<label class="flex items-center justify-center gap-5">
									<input
										type="text"
										class="input w-3/5 appearance-none bg-white"
										bind:value={enteredWorkingHours}
									/>
									<span>시간</span>
								</label>
								<label class="flex items-center justify-center gap-5">
									<input
										type="text"
										class="input w-3/5 appearance-none bg-white"
										bind:value={enteredWorkingMinutes}
									/>
									<span>분</span>
								</label>
							</label>
							<div class="label">
								<span class="label-text-alt"></span>
								<span class="label-text-alt text-gray-700">
									<button onclick={toggleManualInput}>
										범위로 입력 <i class="fa-solid fa-arrow-right"></i>
									</button>
								</span>
							</div>
						{/if}
					</label>
				</form>
			</div>
			<div class="absolute bottom-7 right-7">
				<Button size={Sizes.md} clickHandler={createWork}>추가</Button>
			</div>
		</Box>
	</div>
	<div class="h-fit w-2/3">
		<Box suitability={Suitability.full}>
			<div class="flex h-full w-full flex-col justify-start gap-5">
				{#each works as work}
					<div class="w-full rounded-lg border border-gray-300 p-3 shadow-md">
						<span>{work.company_name}</span>
						<Timer workData={work} refetchWorks={fetchIncompleteWorks} />
					</div>
				{/each}
			</div>
		</Box>
	</div>
</div>
