<script lang="ts">
	import type { FormEventHandler } from 'svelte/elements';

	import { Colors } from '@/constants/Colors';
	import { Suitability } from '@/constants/Suitability';

	import Button from '@/components/ui/Button.svelte';

	type CompanyFormProps = {
		createCompany: (companyName: string) => void;
	};

	let { createCompany }: CompanyFormProps = $props();

	const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const name = formData.get('name');

		if (!name) {
			return;
		}

		createCompany(name.toString());
	};
</script>

<form class="flex flex-col gap-5" onsubmit={submitHandler}>
	<label class="input input-bordered flex items-center gap-2 bg-zinc-300 text-gray-500 shadow-md">
		<input class="grow text-black" placeholder="일하는 곳" name="name" />
	</label>
	<Button type="submit" color={Colors.primary} suitability={Suitability.full}>추가</Button>
</form>
