describe('reset password', () => {
	afterEach(() => {
		cy.resetDb()
	})

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
		cy.visit(`/password-forgotten/verify?email=${this.user.email}&otp=123456`, {
			failOnStatusCode: false,
		}).wait(500)

		cy.location('pathname').should('eq', '/password-forgotten/verify')

		cy.findByText(/invalid otp/i).should('be.visible')
	})
})
