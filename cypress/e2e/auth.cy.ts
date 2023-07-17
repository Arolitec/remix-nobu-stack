import { faker } from '@faker-js/faker'

describe('auth', () => {
	afterEach(() => {
		cy.resetDb()
	})

	describe('register', () => {
		let registerData = {
			email: `${faker.internet.userName()}@example.com`,
			password: faker.internet.password(),
		}

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

	describe('login', () => {
		beforeEach(() => cy.createUser())

		beforeEach(() => {
			cy.visitAndCheck('/')
			cy.findByRole('link', { name: /log in/i }).click()
		})

		it('should allow user to log in and out', function () {
			cy.findByRole('textbox', { name: /email/i }).type(this.user.email)
			cy.findByLabelText(/password/i).type(this.user.password)

			cy.findByRole('button', { name: /log in/i }).click()

			cy.findByText(new RegExp(this.user.email, 'i')).should('be.visible')

			cy.findByRole('button', { name: /logout/i }).click()

			cy.location('pathname').should('eq', '/login')
		})

		it('should show error message if password and email do not match', function () {
			cy.findByRole('textbox', { name: /email/i }).type(this.user.email)
			cy.findByLabelText(/password/i).type('fakepassword')

			cy.findByRole('button', { name: /log in/i }).click()

			cy.findByText(/invalid email\/password/i).should('be.visible')
		})

		it('should display error message if email or/and password are invalid', () => {
			cy.findByRole('textbox', { name: /email/i }).type('bademail')

			cy.findByRole('button', { name: /log in/i }).click()

			cy.findByText(/you must enter a valid mail address/i).should('be.visible')
			cy.findByText(/you must enter a password/i).should('be.visible')
		})
	})

	describe('user is already logged in', () => {
		beforeEach(() => cy.login())

		it('should allow user to logout', () => {
			cy.visitAndCheck('/')
			cy.findByRole('button', { name: /logout/i }).click()

			cy.location('pathname').should('eq', '/login')
		})
	})

	describe('reset password', () => {
		beforeEach(() => cy.createUser())

		it('should allow user to request a password reset', function () {
			cy.visitAndCheck('/password-forgotten')
			cy.findByRole('textbox', { name: /email/i }).type(this.user.email)
			cy.findByRole('button', { name: /send verification mail/i }).click()

			cy.findByText(/we have sent you an e-mail/i).should('be.visible')
		})

		it('should allow user to reset password with valid otp', function () {
			cy.createVerification(this.user.email).then(otp => {
				cy.visit(
					`/password-forgotten/verify?email=${this.user.email}&otp=${otp}`,
				).wait(500)

				cy.location('pathname').should('eq', '/reset-password')

				const password = 'password'
				cy.get('input[name="password"]').type(password, { force: true })
				cy.get('input[name="passwordConfirm"]').type(password, { force: true })
				cy.findByRole('button', { name: /reset password/i }).click()

				cy.location('pathname').should('eq', '/login')
			})
		})

		it('should show error message if otp is invalid', function () {
			cy.visit(
				`/password-forgotten/verify?email=${this.user.email}&otp=123456`,
				{ failOnStatusCode: false },
			).wait(500)

			cy.location('pathname').should('eq', '/password-forgotten/verify')

			cy.findByText(/invalid otp/i).should('be.visible')
		})
	})
})
