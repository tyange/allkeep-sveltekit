<script lang="ts">
	import { onMount } from 'svelte';
	import type { AxiosResponse } from 'axios';

	import type { ResponseData } from '@/types/ResponseData';
	import type { Company } from '@/types/Company';
	import { axiosClient } from '@/api/axiosClient';
	import { Suitability } from '@/constants/Suitability';
	import { getCookieValue } from '@/utils/getCookieValue';

	import CompanyForm from '@/components/CompanyForm.svelte';
	import Box from '@/components/ui/Box.svelte';
	import Button from '@/components/ui/Button.svelte';
	import { Colors } from '@/constants/Colors';
	import { Sizes } from '@/constants/Sizes';

	let companies: Company[] = $state([]);

	const fetchAllCompanies = async () => {
		try {
			const token = getCookieValue('session');

			if (!token) {
				return;
			}

			const res: AxiosResponse<ResponseData<{ companies: Company[] }>> = await axiosClient('/companies/all', {
				headers: { Authorization: token }
			});
			const data = res.data;

			companies = data.companies;
		} catch (err) {
			console.error(err);
		}
	};

	const createCompany = async (companyName: string) => {
		try {
			const token = getCookieValue('session');

			if (!token) {
				return;
			}

			await axiosClient.post('/companies/create', { company_name: companyName }, { headers: { Authorization: token } });
			await fetchAllCompanies();
		} catch (err) {
			console.error(err);
		}
	};

	onMount(() => {
		fetchAllCompanies();
	});
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="flex h-1/2 w-3/5 flex-col gap-5">
		<div>
			<CompanyForm {createCompany} />
		</div>
		<div class="flex-1">
			<Box suitability={Suitability.full}>
				{#if companies.length === 0}
					<p>저장된 일하는 곳이 없습니다.</p>
				{:else}
					<div class="h-full w-full">
						<ul class="flex flex-col gap-5">
							{#each companies as cp}
								<li class="flex w-full items-center rounded-lg border border-gray-300 p-3 shadow-md">
									<span class="flex-1">
										{cp.company_name}
									</span>
									<div>
										<Button size={Sizes.xs} color={Colors.success}>수정</Button>
										<Button size={Sizes.xs} color={Colors.error}>삭제</Button>
									</div>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</Box>
		</div>
	</div>
</div>
