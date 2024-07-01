import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	const session = cookies.get('session');

	if (!session || session === 'undefined') {
		redirect(302, '/');
	}
};
