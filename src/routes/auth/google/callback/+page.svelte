<script lang="ts">
	import { onMount } from 'svelte';
	import axios from 'axios';

	import Box from '@/components/ui/Box.svelte';
	import { goto } from '$app/navigation';

	let isSuccess = $state(false);
	let isError = $state(false);

	const sendCodeToServer = async () => {
		const location = document.location;
		const searchParams = new URLSearchParams(location.search);
		const code = searchParams.get('code');

		if (!code) {
			throw new Error('Invalid google login code.');
		}

		try {
			const data = await axios.post('http://localhost:8080/auth/google', { code });

			console.log(data);
			isSuccess = true;
			// goto('');
		} catch (err) {
			console.log(err);
			isError = true;
		}
	};

	onMount(async () => {
		sendCodeToServer();
	});
</script>

<Box>
	{#if isSuccess}
		<span>구글 로그인에 성공했습니다.</span>
	{:else if isError}
		<span>구글 로그인에 실패했습니다.</span>
	{:else}
		<span>구글 로그인을 시도하는 중입니다...</span>
	{/if}
</Box>
