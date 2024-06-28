<script lang="ts">
	import Button from '@/components/ui/Button.svelte';
	import { Colors } from '@/constants/Colors';
	import { Suitability } from '@/constants/Suitability';

	type CompanyFormProps = {
		showTimerHandler: () => void;
	};

	let { showTimerHandler }: CompanyFormProps = $props();
</script>

<form class="flex flex-col gap-5">
	<label class="input input-bordered flex items-center gap-2 bg-zinc-300 text-gray-500 shadow-md">
		<input class="grow text-black" placeholder="Company Name" />
	</label>
	<Button type="submit" color={Colors.primary} suitability={Suitability.full} clickHandler={showTimerHandler}>
		확인
	</Button>
</form>
