import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch, cookies }) => {
	const session = cookies.get('session');

	if (session && session !== 'undefined') {
		redirect(302, '/');
	}

	const code = url.searchParams.get('code');

	let isSuccess = false;
	let isPending = false;

	if (!code) {
		throw new Error('Invalid google login code.');
	}

	isPending = true;

	try {
		const res = await fetch('http://localhost:8080/auth/google', {
			method: 'POST',
			body: JSON.stringify({ code })
		});
		const data = await res.json();

		cookies.set('session', data.token, {
			path: '/',
			sameSite: 'strict',
			maxAge: 60 * 60 * 2
		});

		isSuccess = true;
		isPending = false;
	} catch (err) {
		console.log(err);
		isSuccess = false;
		isPending = false;
	}

	return {
		auth: {
			isSuccess,
			isPending
		}
	};
};
