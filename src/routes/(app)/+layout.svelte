<script lang="ts">
	import '@/app.css';

	import Header from '@/components/ui/Header.svelte';

	let { data, children } = $props();
</script>

<div class="flex flex-col w-full h-screen">
	<Header isAuth={data.isAuth} />
	{@render children()}
</div>
