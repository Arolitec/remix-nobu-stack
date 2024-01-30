/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		globals: true,
		environment: 'happy-dom',
		setupFiles: ['./test/setup-test-env.ts'],
		include: ['./app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		exclude: ['./tests/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		watchExclude: [
			'.*\\/node_modules\\/.*',
			'.*\\/build\\/.*',
			'.*\\/postgres-data\\/.*',
			'.*\\/playwright-report\\/.*',
		],
		poolMatchGlobs: [
			['**/(loader|action).test.{js,mjs,cjs,ts,mts,cts}', 'forks'],
		],
		server: {
			deps: {
				inline: ['quirrel'],
			},
		},
		coverage: {
			reporter: [process.env.CI ? 'json' : 'html'],
			enabled: true,
			clean: true,
			exclude: [
				'build/**',
				'mocks/**',
				'prisma/**',
				'tests/**',
				'types/**',
				'.yarn/**',
			],
		},
	},
})
