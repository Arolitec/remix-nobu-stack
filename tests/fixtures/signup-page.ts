import type { BrowserContext, Locator, Page } from '@playwright/test'

export class SignUpPage {
	public readonly emailField: Locator
	public readonly passwordField: Locator
	public readonly showPasswordButton: Locator
	public readonly hidePasswordButton: Locator
	public readonly submitButton: Locator

	constructor(
		public readonly page: Page,
		public readonly context: BrowserContext,
	) {
		this.emailField = this.page.getByRole('textbox', { name: /email address/i })
		this.passwordField = this.page.getByRole('textbox', { name: /password/i })
		this.showPasswordButton = this.page.getByRole('button', { name: /show/i })
		this.hidePasswordButton = this.page.getByRole('button', { name: /hide/i })
		this.submitButton = this.page.getByRole('button', {
			name: /create account/i,
		})
	}

	async goTo() {
		await this.page.goto('/join')
	}

	async fillInputs(email: string, password: string) {
		await this.emailField.fill(email)
		await this.passwordField.fill(password)
	}

	async submit() {
		await this.submitButton.click()
	}

	async showPassword() {
		await this.showPasswordButton.click()
	}

	async hidePassword() {
		await this.hidePasswordButton.click()
	}
}
