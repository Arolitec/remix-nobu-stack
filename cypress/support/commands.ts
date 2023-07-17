import { faker } from '@faker-js/faker'

declare global {
	namespace Cypress {
		interface Chainable {
			/**
			 * Logs in with a random user. Yields the user and adds an alias to the user
			 *
			 * @returns {typeof login}
			 * @memberof Chainable
			 * @example
			 *    cy.login()
			 * @example
			 *    cy.login({ email: 'whatever@example.com' })
			 */
			login: typeof login

			/**
			 * Deletes the current @user
			 *
			 * @returns {typeof cleanupUser}
			 * @memberof Chainable
			 * @example
			 *    cy.cleanupUser()
			 * @example
			 *    cy.cleanupUser({ email: 'whatever@example.com' })
			 */
			cleanupUser: typeof cleanupUser

			/**
			 * Extends the standard visit command to wait for the page to load
			 *
			 * @returns {typeof visitAndCheck}
			 * @memberof Chainable
			 * @example
			 *    cy.visitAndCheck('/')
			 *  @example
			 *    cy.visitAndCheck('/', 500)
			 */
			visitAndCheck: typeof visitAndCheck

			/**
			 * Reset database
			 *
			 * @param seed: Boolean
			 * @memberof Chainable
			 * @example
			 *    cy.resetDb()
			 * @example
			 *    cy.resetDb(false)
			 */
			resetDb: typeof resetDb

			/**
			 * Create a user and return its credentials
			 *
			 * @memberof Chainable
			 * @example
			 *    cy.createUser()
			 */
			createUser: typeof createUser

			/**
			 * Create a verification from given
			 */
			createVerification: typeof createVerification
		}
	}
}

function resetDb() {
	return cy.exec(
		`yarn prisma migrate reset -f --skip-seed && yarn prisma migrate deploy && yarn prisma db seed`,
	)
}

function createVerification(email: string) {
	cy.exec(
		`yarn ts-node --require tsconfig-paths/register ./cypress/support/create-verification.ts "${email}"`,
	)
		.then(({ stdout }) => {
			const otp = stdout.replace(/.*<otp>(?<otp>.*)<\/otp>.*/s, '$<otp>').trim()
			return cy.then(() => otp)
		})
		.as('otp')

	return cy.get('@otp')
}

function createUser() {
	const email = faker.internet.email({ provider: 'example.com' })
	const password = faker.internet.password()
	cy.exec(
		`npx ts-node --require tsconfig-paths/register ./cypress/support/create-user.ts "${email}" "${password}"`,
	)
		.then(() => ({ email, password }))
		.as('user')
	return cy.get('@user')
}

function login({
	email = faker.internet.email({
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		provider: 'example.com',
	}),
}: {
	email?: string
} = {}) {
	cy.then(() => ({ email })).as('user')
	cy.exec(
		`npx ts-node --require tsconfig-paths/register ./cypress/support/create-user.ts "${email}"`,
	).then(({ stdout }) => {
		const cookieValue = stdout
			.replace(/.*<cookie>(?<cookieValue>.*)<\/cookie>.*/s, '$<cookieValue>')
			.trim()
		cy.setCookie('_session', cookieValue)
	})
	return cy.get('@user')
}

function cleanupUser({ email }: { email?: string } = {}) {
	if (email) {
		deleteUserByEmail(email)
	} else {
		cy.get('@user').then(user => {
			const email = (user as { email?: string }).email
			if (email) {
				deleteUserByEmail(email)
			}
		})
	}
	cy.clearCookie('_session')
}

function deleteUserByEmail(email: string) {
	cy.exec(
		`npx ts-node --require tsconfig-paths/register ./cypress/support/delete-user.ts "${email}"`,
	)
	cy.clearCookie('_session')
}

// We're waiting a second because of this issue happen randomly
// https://github.com/cypress-io/cypress/issues/7306
// Also added custom types to avoid getting detached
// https://github.com/cypress-io/cypress/issues/7306#issuecomment-1152752612
// ===========================================================
function visitAndCheck(url: string, waitTime: number = 1000) {
	cy.visit(url)
	cy.location('pathname').should('contain', url).wait(waitTime)
}

Cypress.Commands.add('login', login)
Cypress.Commands.add('cleanupUser', cleanupUser)
Cypress.Commands.add('visitAndCheck', visitAndCheck)
Cypress.Commands.add('resetDb', resetDb)
Cypress.Commands.add('createUser', createUser)
Cypress.Commands.add('createVerification', createVerification)
