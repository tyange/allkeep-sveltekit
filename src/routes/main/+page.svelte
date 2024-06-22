<script lang="ts">
	import { counter } from '@/lib/timer';
</script>

<p>{$counter}</p>
<button onclick={counter.increment}>plus</button>
<button onclick={counter.decrement}>minus</button>
