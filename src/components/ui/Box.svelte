<script lang="ts">
	import type { Snippet } from 'svelte';

	interface BoxProps {
		children?: Snippet;
	}

	let { children }: BoxProps = $props();
</script>

<div
	class="flex w-fit items-center justify-center rounded-lg border border-gray-300 bg-white bg-opacity-90 p-10 text-black shadow-md"
>
	{#if !children}
		coming soon
	{:else}
		{@render children()}
	{/if}
</div>
