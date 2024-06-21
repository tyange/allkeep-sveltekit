import type { Meta, StoryObj } from '@storybook/svelte';

import Box from '@/components/ui/Box.svelte';

const meta = {
	title: 'Components/Box',
	component: Box,
	parameters: {
		layout: 'centered'
	},
	tags: ['autodocs']
} satisfies Meta<Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
