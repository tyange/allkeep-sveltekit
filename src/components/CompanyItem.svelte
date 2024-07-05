<script lang="ts">
	import type { Company } from '@/types/Company';

	type CompanyProps = {
		company: Company;
		editCompany: (companyId: number, enteredCompanyName: string) => void;
		deleteCompany: (companyId: number) => void;
	};

	let { company, editCompany, deleteCompany }: CompanyProps = $props();

	let isEditing = $state(false);
	let enteredCompanyName = $state('');

	let inputElement: HTMLInputElement | null = $state(null);

	const editHandler = () => {
		isEditing = true;
	};

	const submitHandler = (companyId: number) => {
		isEditing = false;
		editCompany(companyId, enteredCompanyName);
	};

	$effect(() => {
		if (inputElement) {
			inputElement.focus();
		}
	});
</script>

<li
	class="flex h-20 w-full items-center rounded-lg border border-gray-300 p-3 shadow-md"
>
	{#if !isEditing}
		<span class=" flex-1">
			{company.company_name}
		</span>
	{:else}
		<input
			type="text"
			class="input mr-5 min-w-10 flex-1 bg-white bg-opacity-90"
			bind:this={inputElement}
			bind:value={enteredCompanyName}
		/>
	{/if}
	{#if !isEditing}
		<div>
			<button
				class="rounded-md border bg-success transition-all hover:border-green-500 hover:shadow-lg"
				onclick={editHandler}
			>
				<i class="fa-solid fa-pen-to-square p-2"></i>
			</button>
			<button
				class="rounded-md border bg-error transition-all hover:border-red-500 hover:shadow-lg"
				onclick={() => deleteCompany(company.ID)}
			>
				<i class="fa-solid fa-trash p-2"></i>
			</button>
		</div>
	{:else}
		<div>
			<button
				class="rounded-md border bg-success transition-all hover:border-green-500 hover:shadow-lg"
				onclick={() => submitHandler(company.ID)}
			>
				<i class="fa-solid fa-check p-2"></i>
			</button>
			<button
				class="rounded-md border bg-error transition-all hover:border-red-500 hover:shadow-lg"
			>
				<i class="fa-solid fa-x p-2"></i>
			</button>
		</div>
	{/if}
</li>
