import type { Meta, StoryObj } from '@storybook/svelte';
import { fn } from '@storybook/test';

import { Suitability } from '@/constants/Suitability';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';

import Button from '@/components/ui/Button.svelte';

const meta = {
	title: 'Components/Button',
	component: Button,
	parameters: {
		layout: 'centered'
	},
	tags: ['autodocs'],
	argTypes: {
		suitability: {
			control: 'radio',
			options: [...Object.values(Suitability)]
		},
		color: {
			control: 'radio',
			options: [...Object.values(Colors)]
		},
		size: {
			control: 'radio',
			options: [...Object.values(Sizes)]
		}
	},
	args: { clickHandler: fn() }
} satisfies Meta<Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
