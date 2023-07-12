import { faker } from '@faker-js/faker'

describe('smoke tests', () => {
	afterEach(() => {
		cy.resetDb()
	})

	it('should allow user to register and logout', () => {
		const loginForm = {
			email: `${faker.internet.userName()}@example.com`,
			password: faker.internet.password(),
		}
		cy.then(() => ({ email: loginForm.email })).as('user')

		cy.visitAndCheck('/')
		cy.findByRole('link', { name: /sign up/i }).click()

		cy.findByRole('textbox', { name: /email/i }).type(loginForm.email)
		cy.findByLabelText(/password/i).type(loginForm.password)
		cy.findByRole('button', { name: /create account/i })
			.click()
			.wait(2000)

		cy.findByText(new RegExp(loginForm.email, 'i')).should('be.visible')

		cy.findByRole('button', { name: /logout/i }).click()
		cy.findByRole('button', { name: /log in/i }).should('be.visible')
		cy.location('pathname').should('eq', '/login')
	})

	it('should allow user to login amd logout', () => {
		cy.createUser().then(user => {
			cy.visitAndCheck('/')
			cy.findByRole('link', { name: /log in/i }).click()

			cy.findByRole('textbox', { name: /email/i }).type(user.email)
			cy.findByLabelText(/password/i).type(user.password)

			cy.findByRole('button', { name: /log in/i }).click()

			cy.findByText(new RegExp(user.email, 'i')).should('be.visible')

			cy.findByRole('button', { name: /logout/i }).click()

			cy.location('pathname').should('eq', '/login')
		})
	})

	it('should land to / is already logged', () => {
		cy.login()
		cy.visitAndCheck('/')

		cy.findByRole('link', { name: /logout/ })
			.should('be.visible')
			.as('logout')
	})

	// it('should allow you to make a note', () => {
	// 	const testNote = {
	// 		title: faker.lorem.words(1),
	// 		body: faker.lorem.sentences(1),
	// 	}
	// 	cy.login()
	// 	cy.visitAndCheck('/')

	// 	cy.findByRole('link', { name: /notes/i }).click()
	// 	cy.findByText('No notes yet')

	// 	cy.findByRole('link', { name: /\+ new note/i }).click()

	// 	cy.findByRole('textbox', { name: /title/i }).type(testNote.title)
	// 	cy.findByRole('textbox', { name: /body/i }).type(testNote.body)
	// 	cy.findByRole('button', { name: /save/i }).click()

	// 	cy.findByRole('button', { name: /delete/i }).click()

	// 	cy.findByText('No notes yet')
	// })
})
