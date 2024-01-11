import { test as base } from '@playwright/test'
import { installGlobals } from '@remix-run/node'
import { DatabaseSetup } from './db'
import { SignUpPage } from './signup-page'

installGlobals()

type Fixtures = {
	db: DatabaseSetup
	signupPage: SignUpPage
}

const test = base.extend<Fixtures>({
	db: async ({}, use) => {
		await use(new DatabaseSetup())
	},
	signupPage: async ({ page, context }, use) => {
		await use(new SignUpPage(page, context))
	},
})

export { expect } from '@playwright/test'
export { test }
