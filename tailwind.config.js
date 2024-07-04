import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				whLight: {
					primary: '#005eff',
					secondary: '#00bfbe',
					accent: '#00ff4e',
					neutral: '#0c110d',
					'base-100': '#fffaff',
					info: '#00f7ff',
					success: '#00ae6d',
					warning: '#ff9500',
					error: '#e63746'
				}
			},
			{
				whDark: {
					primary: '#00cff5',
					secondary: '#ac0000',
					accent: '#a98e00',
					neutral: '#292929',
					'base-100': '#223034',
					info: '#007cd6',
					success: '#17ba47',
					warning: '#ff8400',
					error: '#ff95a3'
				}
			}
		],
		darkTheme: 'whDark'
	}
};
