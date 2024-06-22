<script lang="ts">
	import { Colors } from '@/constants/Colors';
	import { Suitability } from '@/constants/Suitability';

	import Button from '@/components/ui/Button.svelte';

	const googleLoginParams = new URLSearchParams({
		client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
		redirect_uri: 'http://localhost:5173/auth/google/callback',
		scope: 'https://www.googleapis.com/auth/userinfo.email',
		include_granted_scopes: 'true',
		response_type: 'code'
	});

	const googleLoginUrl =
		'https://accounts.google.com/o/oauth2/v2/auth?' + googleLoginParams.toString();
</script>

<div class="flex flex-col gap-5">
	<form class="flex flex-col gap-5">
		<label class="input input-bordered flex items-center gap-2 bg-zinc-300 text-gray-500 shadow-md">
			ID
			<input type="text" class="grow text-black" />
		</label>
		<label class="input input-bordered flex items-center gap-2 bg-zinc-300 text-gray-500 shadow-md">
			PW
			<input type="password" class="grow text-black" />
		</label>
		<Button type="submit" label="로그인" color={Colors.info} suitability={Suitability.full} />
	</form>
	<Button type="submit" label="가입하기" color={Colors.accent} suitability={Suitability.full} />
	<a href={googleLoginUrl}>
		<Button label="구글 로그인" color={Colors.neutral} suitability={Suitability.full} />
	</a>
</div>
