import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
	let isAuth = false;

	const session = cookies.get('session');

	if (session && session !== 'undefined') {
		isAuth = true;
	}

	return {
		isAuth
	};
};
