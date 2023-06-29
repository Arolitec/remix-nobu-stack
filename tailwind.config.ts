import type { Config } from 'tailwindcss'

export default {
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {},
	},
	plugins: [require('daisyui')],
	daisyui: {
		// If you want to create a custom theme, uncomment and update color
		// values or use the theme generator -> https://daisyui.com/theme-generator/.
		// More on theme -> https://daisyui.com/docs/themes/
		//
		// 	themes: [
		// 		{
		// 			awesomeTheme: {
		// 				primary: '#570df8',
		// 				secondary: '#f000b8',
		// 				accent: '#1dcdbc',
		// 				neutral: '#2b3440',
		// 				'base-100': '#ffffff',
		// 				info: '#3abff8',
		// 				success: '#36d399',
		// 				warning: '#fbbd23',
		// 				error: '#f87272',
		// 			},
		// 		},
		// 	],
	},
} satisfies Config
