import { faker } from '@faker-js/faker'
import type { Cookie } from '@playwright/test'
import { test as base } from '@playwright/test'
import type { User } from '@prisma/client'
import { installGlobals } from '@remix-run/node'
import execa from 'execa'
import { prisma } from '~/utils/db.server'
import { generateTOTP } from '~/utils/otp.server'
import { createSessionCookie } from '../utils/auth'
import { PasswordForgottenPage } from './password-forgotten-page'
import { PasswordResetPage } from './password-rest-page'
import { SignInPage } from './signin-page'
import { SignUpPage } from './signup-page'

installGlobals()

type Fixtures = {
	setupDb: () => Promise<void>
	createUser: (email?: string, password?: string) => Promise<User>
	createManyUsers: (count: number) => Promise<User[]>
	createVerification: (email?: string) => Promise<string>
	login: (email?: string, password?: string) => Promise<void>
	getSessionCookie: () => Promise<Cookie | undefined>
	signupPage: SignUpPage
	signInPage: SignInPage
	passwordForgottenPage: PasswordForgottenPage
	passwordResetPage: PasswordResetPage
}

const test = base.extend<Fixtures>({
	// eslint-disable-next-line no-empty-pattern
	setupDb: async ({}, use) => {
		await use(async () => {
			await execa('yarn', ['prisma', 'migrate', 'reset', '-f'], {
				stdio: 'inherit',
			})
		})
	},
	// eslint-disable-next-line no-empty-pattern
	createUser: async ({}, use) => {
		await use(
			(
				email = faker.internet.email(),
				password = faker.internet.password(),
			) => {
				return prisma.user.createUser(email, password)
			},
		)
	},
	createManyUsers: async ({ createUser }, use) => {
		await use(async (count = 1) => {
			const promises$ = Array.from({ length: count }).map(() => createUser())
			return Promise.all(promises$)
		})
	},
	login: async ({ context }, use) => {
		await use(async (email?: string, password?: string) => {
			const cookie = await createSessionCookie(email, password)

			await context.addCookies([
				{
					name: '_session',
					value: cookie,
					domain: 'localhost',
					path: '/',
					httpOnly: true,
					secure: false,
					sameSite: 'Lax',
				},
			])
		})
	},
	createVerification: async ({}, use) => {
		await use(async (email = faker.internet.email()) => {
			const otpData = generateTOTP()

			await prisma.verification.create({
				data: {
					algorithm: otpData.algorithm,
					digits: 6,
					email,
					period: otpData.step,
					expiresAt: otpData.expiresAt,
					secret: otpData.secret,
				},
			})

			return otpData.otp
		})
	},
	getSessionCookie: async ({ context }, use) => {
		await use(async () => {
			const cookies = await context.cookies()
			const cookieName = '_session'
			return cookies.find(c => c.name === cookieName)
		})
	},
	signupPage: async ({ page, context }, use) => {
		await use(new SignUpPage(page, context))
	},
	signInPage: async ({ page, context }, use) => {
		await use(new SignInPage(page, context))
	},
	passwordForgottenPage: async ({ page }, use) => {
		await use(new PasswordForgottenPage(page))
	},
	passwordResetPage: async ({ page }, use) => {
		await use(new PasswordResetPage(page))
	},
})

export { expect } from '@playwright/test'
export { test }
