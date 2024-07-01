<script lang="ts">
	import type { Snippet } from 'svelte';
	import classnames from 'classnames';

	import { Suitability } from '@/constants/Suitability';

	const Width: { [Key in Suitability]: string } = {
		[Suitability.fit]: 'w-fit',
		[Suitability.full]: 'w-full'
	};

	interface BoxProps {
		suitability?: Suitability;
		children?: Snippet;
	}

	let { suitability = Suitability.fit, children }: BoxProps = $props();

	const cNames = () => classnames([Width[suitability]]);
</script>

<div
	class={'flex h-full items-center justify-center rounded-lg border border-gray-300 bg-white bg-opacity-90 p-10 text-black shadow-md' +
		' ' +
		cNames()}
>
	{#if !children}
		coming soon
	{:else}
		{@render children()}
	{/if}
</div>
