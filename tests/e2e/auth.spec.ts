import { expect, test } from '../fixtures'
import { generateUserCredentials } from '../utils/user'

test.describe('register', async () => {
	test.beforeAll(async ({ setupDb }) => {
		await setupDb()
	})

	test.beforeEach(async ({ page }) => {
		await page.goto('/join')
	})

	test('has title', async ({ page }) => {
		await expect(page).toHaveTitle(/Sign Up/i)
	})

	test('should allow user to register and get redirected to "/" page', async ({
		page,
		signupPage,
		getSessionCookie,
	}) => {
		const user = generateUserCredentials()
		await signupPage.fillInputs(user.email, user.password)

		await signupPage.submit()

		await expect(page).toHaveURL('/')
		await expect(page.getByText(new RegExp(user.email, 'i'))).toBeVisible()

		expect(getSessionCookie()).toBeDefined()
	})

	test('should display error message if email or password are invalid', async ({
		signupPage,
		page,
	}) => {
		const invalidEmail = 'bademail'
		const invalidPassword = 'badpwd'

		await signupPage.fillInputs(invalidEmail, invalidPassword)
		await signupPage.submit()

		await expect(
			page.getByText(/you must enter a valid mail address/i),
		).toBeVisible()
		await expect(
			page.getByText(/password must be at least 8 characters/i),
		).toBeVisible()
	})

	test('should display error message if email is already taken', async ({
		createUser,
		signupPage,
		page,
	}) => {
		const user = generateUserCredentials()
		await createUser(user.email, user.password)

		const userWithSameEmail = generateUserCredentials(user.email)

		await signupPage.fillInputs(
			userWithSameEmail.email,
			userWithSameEmail.password,
		)
		await signupPage.submit()

		await expect(
			page.getByText(/a user already exists with this email/i),
		).toBeVisible()
	})

	test('should show/hide password', async ({ signupPage, page }) => {
		const user = generateUserCredentials()
		await signupPage.fillInputs(user.email, user.password)

		await signupPage.showPassword()
		await expect(signupPage.passwordField).toHaveAttribute('type', 'text')

		await signupPage.hidePassword()
		await expect(signupPage.passwordField).toHaveAttribute('type', 'password')
	})
})

test.describe('[logged in] signin', async () => {
	test.beforeAll(async ({ setupDb }) => {
		await setupDb()
	})

	test.beforeEach(async ({ login }) => {
		await login()
	})

	test('should redirect to "/" page', async ({ page }) => {
		await page.goto('/join')
		await expect(page).toHaveURL('/')

		await expect(page.getByText(/logout/i)).toBeVisible()
		await expect(page.getByText(/@example.com/i)).toBeVisible()
	})
})

test.describe('[logged out] sign in', async () => {
	test.beforeAll(async ({ setupDb }) => {
		await setupDb()
	})

	test.beforeEach(async ({ signInPage }) => {
		signInPage.goTo()
	})

	test('should login', async ({
		page,
		createUser,
		signInPage,
		getSessionCookie,
	}) => {
		const credentials = generateUserCredentials()
		await createUser(credentials.email, credentials.password)

		await signInPage.fillInputs(credentials.email, credentials.password)
		await signInPage.submit()

		await expect(page).toHaveURL('/')

		expect(getSessionCookie()).toBeDefined()
	})

	test('should display error message if email or password are invalid', async ({
		signInPage,
		page,
	}) => {
		const badCredentials = generateUserCredentials()
		await signInPage.fillInputs(badCredentials.email, badCredentials.password)

		await signInPage.submit()

		await expect(
			signInPage.page.getByText(/invalid email\/password/i),
		).toBeVisible()

		await expect(page).not.toHaveURL('/')
	})
})
