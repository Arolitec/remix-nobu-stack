import type { Config } from 'tailwindcss'

export default {
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {},
	},
	plugins: [require('daisyui')],
	daisyui: {
		// If you want to create a custom theme -> https://daisyui.com/docs/themes/
		themes: false,
		logs: false,
	},
} satisfies Config
