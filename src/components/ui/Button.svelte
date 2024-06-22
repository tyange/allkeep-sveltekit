<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import classnames from 'classnames';

	import { Colors } from '../../constants/Colors';
	import { Sizes } from '../../constants/Sizes';
	import { Suitability } from '../../constants/Suitability';

	const Width: { [Key in Suitability]: string } = {
		[Suitability.fit]: 'w-fit',
		[Suitability.full]: 'w-full'
	};

	const PaddingX: { [Key in Sizes]: string } = {
		[Sizes.xs]: 'px-3',
		[Sizes.sm]: 'px-5',
		[Sizes.md]: 'px-10',
		[Sizes.lg]: 'px-14'
	};

	const BtnColors: { [Key in Colors]: string } = {
		[Colors.primary]: 'btn-primary',
		[Colors.secondary]: 'btn-secondary',
		[Colors.accent]: 'btn-accent',
		[Colors.success]: 'btn-success',
		[Colors.warning]: 'btn-warning',
		[Colors.error]: 'btn-error',
		[Colors.info]: 'btn-info',
		[Colors.neutral]: 'btn-neutral'
	};

	interface ButtonProps extends HTMLButtonAttributes {
		isShow?: boolean;
		label?: string;
		color?: Colors;
		size?: Sizes;
		suitability?: Suitability;
		clickHandler?: () => void;
	}

	let {
		type = 'button',
		isShow = true,
		label = 'Button',
		color = Colors.primary,
		size = Sizes.sm,
		suitability = Suitability.fit,
		clickHandler
	}: ButtonProps = $props();

	const cNames = () =>
		classnames([
			'btn',
			'btn-square',
			'shadow-md',
			Width[suitability],
			BtnColors[color],
			PaddingX[size]
		]);
</script>

{#if isShow}
	<button {type} class={cNames()} onclick={clickHandler}>{label}</button>
{/if}
