describe('login', () => {
	afterEach(() => {
		cy.resetDb()
	})

	beforeEach(() => {
		cy.createUser().debug()

		cy.visitAndCheck('/login')
	})

	describe('user not logged in', () => {
		it('should display error message if email or/and password are invalid', function () {
			cy.findByRole('textbox', { name: /email/i }).type('bademail')

			cy.findByRole('button', { name: /log in/i }).click()

			cy.findByText(/you must enter a valid mail address/i).should('be.visible')
			cy.findByText(/you must enter a password/i).should('be.visible')
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
	})

	describe('user is already logged in', () => {
		beforeEach(() => cy.login())

		it('should allow user to logout', () => {
			cy.visitAndCheck('/')
			cy.findByRole('button', { name: /logout/i }).click()

			cy.location('pathname').should('eq', '/login')
		})
	})
})
