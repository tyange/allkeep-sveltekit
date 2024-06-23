<script lang="ts">
	import '@/app.css';

	import Header from '@/components/ui/Header.svelte';

	let { data, children } = $props();
</script>

<Header isAuth={data.isAuth} />
{@render children()}
