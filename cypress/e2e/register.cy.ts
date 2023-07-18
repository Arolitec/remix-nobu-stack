import { faker } from '@faker-js/faker'

describe('register', () => {
	let registerData = {
		email: `${faker.internet.userName()}@example.com`,
		password: faker.internet.password(),
	}

	afterEach(() => {
		cy.resetDb()
	})

	beforeEach(() => {
		cy.visitAndCheck('/join')
	})

	it('should allow user to register and get redirected to "/" page', () => {
		cy.findByRole('textbox', { name: /email/i }).type(registerData.email)
		cy.findByLabelText(/password/i).type(registerData.password)
		cy.findByRole('button', { name: /create account/i }).click()

		cy.location('pathname', {
			timeout: 10000,
		}).should('eq', '/')

		cy.findByText(new RegExp(registerData.email.toLowerCase(), 'i')).should(
			'be.visible',
		)

		cy.getCookie('_session').should('exist')
	})

	it('should display error message if email or password are invalid', () => {
		const invalidEmail = 'bademail'
		const invalidPassword = 'badpwd'

		cy.findByRole('textbox', { name: /email/i }).type(invalidEmail)
		cy.findByLabelText(/password/i).type(invalidPassword)

		cy.findByRole('button', { name: /create account/i }).click()

		cy.findByText(/you must enter a valid mail address/i).should('be.visible')
		cy.findByText(/password must be at least 8 characters/i).should(
			'be.visible',
		)
	})
})
