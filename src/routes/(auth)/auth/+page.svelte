<script lang="ts">
	import type { FormEventHandler } from 'svelte/elements';
	import { goto } from '$app/navigation';
	import type { AxiosError } from 'axios';
	import { axiosClient } from '@/api/axiosClient';

	import { Colors } from '@/constants/Colors';
	import { Suitability } from '@/constants/Suitability';

	import Box from '@/components/ui/Box.svelte';
	import Button from '@/components/ui/Button.svelte';

	let isLoginLoading = $state(false);
	let loginError: null | string = $state(null);
	let isGoogleLoginLoading = $state(false);

	const googleLoginParams = new URLSearchParams({
		client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
		redirect_uri: 'http://localhost:5173/auth/google/callback',
		scope: 'https://www.googleapis.com/auth/userinfo.email',
		include_granted_scopes: 'true',
		response_type: 'code'
	});

	const googleLoginUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + googleLoginParams.toString();
	const googleLoginHandler = () => {
		isGoogleLoginLoading = true;
		location.href = googleLoginUrl;
	};

	const loginHandler: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		isLoginLoading = true;

		const formData = new FormData(e.currentTarget);
		const email = formData.get('email');
		const password = formData.get('password');

		if (!email || email === '' || !password || password === '') {
			isLoginLoading = false;
			return;
		}

		try {
			await axiosClient.post(
				'/auth/login',
				{
					email,
					password
				},
				{ withCredentials: true }
			);

			isLoginLoading = false;
			goto('/');
		} catch (err) {
			const errRes = (err as AxiosError).response;

			if (!errRes) {
				console.error(err);
				return;
			}

			if (errRes.status === 401) {
				loginError = '아이디나 비밀번호가 틀렸습니다.';
			}

			isLoginLoading = false;
		}
	};
</script>

<Box>
	<div class="flex flex-col gap-5">
		<form class="flex flex-col gap-5" onsubmit={loginHandler}>
			<label class="input input-bordered flex items-center gap-2 bg-zinc-300 text-gray-500 shadow-md">
				EMAIL
				<input type="email" class="grow text-black" name="email" />
			</label>
			<label class="input input-bordered flex items-center gap-2 bg-zinc-300 text-gray-500 shadow-md">
				PW
				<input type="password" class="grow text-black" name="password" />
			</label>
			{#if loginError}
				<p class="text-red-500 text-center">{loginError}</p>
			{/if}
			<Button
				type="submit"
				disabled={isLoginLoading || isGoogleLoginLoading}
				color={Colors.info}
				suitability={Suitability.full}
			>
				{#if isLoginLoading}
					<span class="loading loading-dots loading-sm"></span>
				{:else}
					로그인
				{/if}
			</Button>
		</form>
		<Button
			disabled={isLoginLoading || isGoogleLoginLoading}
			color={Colors.neutral}
			suitability={Suitability.full}
			clickHandler={googleLoginHandler}
		>
			{#if isGoogleLoginLoading}
				<span class="loading loading-dots loading-sm"></span>
			{:else}
				구글 로그인
			{/if}
		</Button>
	</div>
</Box>
