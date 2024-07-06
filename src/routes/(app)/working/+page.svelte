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

	import Box from '@/components/ui/Box.svelte';
	import Button from '@/components/ui/Button.svelte';
	import WorkComponent from '@/components/WorkComponent.svelte';

	let works: Work[] = $state([]);
	let companies: Company[] = $state([]);

	const fetchWorks = async () => {
		try {
			const token = getCookieValue('session');

			if (!token) {
				return;
			}

			const res: AxiosResponse<ResponseData<{ works: Work[] }>> =
				await axiosClient('/works/all', {
					headers: { Authorization: token }
				});

			works = res.data.works ?? [];
		} catch (err) {
			console.error(err);
		}
	};

	const fetchAllCompanies = async () => {
		try {
			const token = getCookieValue('session');

			if (!token) {
				return;
			}

			const res: AxiosResponse<ResponseData<{ companies: Company[] }>> =
				await axiosClient('/companies/all-at-once', {
					headers: { Authorization: token }
				});

			const data = res.data;

			companies = data.companies;
		} catch (err) {
			console.error(err);
		}
	};

	onMount(() => {
		fetchWorks();
		fetchAllCompanies();
	});
</script>

<div class="flex w-full flex-1 items-center justify-center">
	<div class="relative h-96 w-2/3">
		<Box suitability={Suitability.full}>
			<div
				class="relative flex h-full w-full flex-col items-center justify-center"
			>
				<form class="flex h-full w-full flex-col gap-10">
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text text-gray-700">일하는 곳</span>
						</div>
						<select class="select bg-white">
							{#each companies as company}
								<option value={company.id}>{company.company_name}</option>
							{/each}
						</select>
					</label>
					<label class="form-control">
						<div class="label">
							<span class="label-text text-gray-700">몇 시간 일을 하나요?</span>
						</div>
						<input
							type="range"
							min="0"
							max="12"
							value="1"
							class="range"
							step="1"
						/>
						<div class="flex w-full justify-between px-2 text-xs">
							<span>0</span>
							<span>1</span>
							<span>2</span>
							<span>3</span>
							<span>4</span>
							<span>5</span>
							<span>6</span>
							<span>7</span>
							<span>8</span>
							<span>9</span>
							<span>10</span>
							<span>11</span>
							<span>12</span>
						</div>
						<div class="label">
							<span class="label-text-alt"></span>
							<span class="label-text-alt text-gray-700">
								<button>
									아니면 직접 입력 <i class="fa-solid fa-arrow-right"></i>
								</button>
							</span>
						</div>
					</label>
				</form>
			</div>
			<div class="absolute bottom-7 right-7">
				<Button size={Sizes.md}>추가</Button>
			</div>
		</Box>
		{#if works.length > 0}
			{#each works as work}
				<WorkComponent name={String(work.id)} />
			{/each}
		{/if}
	</div>
</div>
