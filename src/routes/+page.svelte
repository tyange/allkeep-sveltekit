<script>
	import { Colors } from '../constants/Colors';
	import { Sizes } from '../constants/Sizes';

	import Button from '../components/ui/Button.svelte';
	import Box from '../components/ui/Box.svelte';
</script>

<p class="text-red-500">white shadow frontend</p>
<button class="btn btn-primary">hi</button>
<Button size={Sizes.md} color={Colors.warning} label="TEST" onClick={() => console.log('bye')} />
<Box>hihihihihi</Box>
