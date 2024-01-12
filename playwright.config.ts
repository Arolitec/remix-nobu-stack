import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

const PORT = process.env.PORT || '3000'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests/e2e',
	expect: {
		timeout: 10000,
	},
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'test env setup',
			testMatch: /test-env\.ts/,
		},
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
			dependencies: ['test env setup'],
		},
	],
	webServer: {
		command: `yarn start-server-and-test ${
			process.env.CI ? 'start:mocks' : 'dev'
		} http://127.0.0.1:${PORT}`,
		reuseExistingServer: !process.env.CI,
		port: Number(PORT),
		stderr: 'pipe',
		env: {
			PORT,
		},
	},
})
