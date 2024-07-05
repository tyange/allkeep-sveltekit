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

	const cancelHandler = () => {
		isEditing = false;
	};

	$effect(() => {
		if (inputElement) {
			inputElement.focus();
			enteredCompanyName = company.company_name;
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
			class="input mr-5 min-w-10 flex-1 bg-white bg-opacity-90 focus:input-bordered focus:border-primary"
			bind:this={inputElement}
			bind:value={enteredCompanyName}
		/>
	{/if}
	{#if !isEditing}
		<div>
			<button
				class="h-10 w-10 rounded-md border bg-success transition-all hover:border-green-500 hover:shadow-lg"
				onclick={editHandler}
			>
				<i class="fa-solid fa-pen-to-square"></i>
			</button>
			<button
				class="h-10 w-10 rounded-md border bg-error transition-all hover:border-red-500 hover:shadow-lg"
				onclick={() => deleteCompany(company.id)}
			>
				<i class="fa-solid fa-trash"></i>
			</button>
		</div>
	{:else}
		<div>
			<button
				class="h-10 w-10 rounded-md border bg-success transition-all hover:border-green-500 hover:shadow-lg"
				onclick={() => submitHandler(company.id)}
			>
				<i class="fa-solid fa-check"></i>
			</button>
			<button
				class="h-10 w-10 rounded-md border bg-error transition-all hover:border-red-500 hover:shadow-lg"
				onclick={cancelHandler}
			>
				<i class="fa-solid fa-x"></i>
			</button>
		</div>
	{/if}
</li>
