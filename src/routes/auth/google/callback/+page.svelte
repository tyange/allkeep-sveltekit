<script lang="ts">
	import type { PageData } from './$types';

	import Box from '@/components/ui/Box.svelte';

	export let data: PageData;
</script>

<Box>
	{#if data.auth.isSuccess && !data.auth.isPending}
		<span>구글 로그인에 성공했습니다.</span>
	{/if}
	{#if !data.auth.isSuccess && !data.auth.isPending}
		<span>구글 로그인에 실패했습니다.</span>
	{/if}
	{#if data.auth.isPending}
		<span>구글 로그인을 시도하는 중입니다...</span>
	{/if}
</Box>
