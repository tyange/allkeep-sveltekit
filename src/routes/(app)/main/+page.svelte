<script lang="ts">
	import { onMount } from 'svelte';

	import { axiosClient } from '@/api/axiosClient';
	import { getCookieValue } from '@/utils/getCookieValue';

	import Work from '@/components/Work.svelte';

	const fetchWorks = async () => {
		try {
			const token = getCookieValue('session');

			if (!token) {
				return;
			}

			const data = await axiosClient('/works/all', {
				headers: { Authorization: token }
			});
			console.log(data);
		} catch (err) {
			console.error(err);
		}
	};

	onMount(() => {
		fetchWorks();
	});
</script>

<div>
	<Work name="timer0" />
</div>
