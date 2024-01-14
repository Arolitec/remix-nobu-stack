/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
	root: true,
	extends: [
		'@remix-run/eslint-config',
		'@remix-run/eslint-config/node',
		'@remix-run/eslint-config/jest-testing-library',
		'plugin:playwright/recommended',
		'prettier',
	],
	// We're using vitest which has a very similar API to jest
	// (so the linting plugins work nicely), but we have to
	// set the jest version explicitly.
	settings: {
		jest: {
			version: 28,
		},
	},
	overrides: [
		{
			// Prevent @remix-run/eslint-config/jest-testing-library to be applied on playwright tests
			excludedFiles: ['tests/**/?(*.)+(spec|test).[jt]s'],
			extends: ['@remix-run/eslint-config/jest-testing-library'],
		},
	],
}
