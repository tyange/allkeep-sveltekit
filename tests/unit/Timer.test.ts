import '@testing-library/jest-dom';
import { expect, test } from 'vitest';
import { render } from '@testing-library/svelte';
import Timer from '@/components/Timer.svelte';

test('render Timer', async () => {
	const { container } = render(Timer, {
		props: {
			workData: {
				id: 1,
				company_id: 1,
				company_name: 'test',
				working_time: 60,
				start_at: null,
				done_at: null,
				pause_at: null,
				is_pause: false,
				is_done: false,
				user_id: 1
			},
			refetchWorks: () => new Promise(() => console.log('timer test'))
		}
	});
	const timerElement = container.querySelector('.timer');
	expect(timerElement).toBeInTheDocument();
});
