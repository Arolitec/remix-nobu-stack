import { User } from '@prisma/client'
import { authenticator } from '~/utils/auth.server'
import action from '../action'

vi.mock('~/utils/auth.server', async () => ({
	...(await vi.importActual('~/utils/auth.server')),
	authenticator: {
		authenticate: vi.fn(),
	},
}))

describe('[login] action', () => {
	const mockedAuthenticate = vi.mocked(authenticator.authenticate)
	const user = { id: '123' } as User

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should return response with status 400 if submission is invalid', async () => {
		mockedAuthenticate.mockImplementation(() => {
			throw new Error('Invalid email/password')
		})

		const body = new FormData()
		body.append('email', 'fake@example.com')
		body.append('password', 'fakepassword')

		const request = new Request('http://test/login', {
			method: 'POST',
			body,
		})

		const response = await action({ request, context: {}, params: {} })

		expect(response.status).toBe(400)
	})

	it('should redirect to redirectTo url if login succeeded', async () => {
		mockedAuthenticate.mockResolvedValue(user)

		const redirectTo = '/'
		const body = new FormData()
		body.append('email', 'test@example.com')
		body.append('password', 'password')
		body.append('redirectTo', redirectTo)

		const request = new Request('http://test/login', {
			method: 'POST',
			body,
		})

		const response = await action({ request, context: {}, params: {} })

		expect(response.status).toBe(302)
		expect(response.headers.get('Location')).toBe(redirectTo)
	})

	it('should set session cookie if login succeeded', async () => {
		mockedAuthenticate.mockResolvedValue(user)

		const body = new FormData()
		body.append('email', 'test@example.com')
		body.append('password', 'password')
		body.append('redirectTo', '/')

		const request = new Request('http://test/login', {
			method: 'POST',
			body,
		})

		const response = await action({ request, context: {}, params: {} })

		expect(response.headers.get('Set-Cookie')).toContain(`_session=`)
	})

	it('should set max-age cookie if remember is checked on redirect response', async () => {
		mockedAuthenticate.mockResolvedValue(user)

		const body = new FormData()
		body.append('email', 'test@example.com')
		body.append('password', 'fakepassword')
		body.append('redirectTo', '/')
		body.append('remember', 'on')

		const request = new Request('http://test/login', {
			method: 'POST',
			body,
		})

		const response = await action({ request, context: {}, params: {} })

		expect(response.status).toBe(302)
		expect(response.headers.get('Set-Cookie')).toContain('Max-Age=604800')
	})

	it('should not set max-age cookie if remember is not checked on redirect response', async () => {
		mockedAuthenticate.mockResolvedValue(user)

		const body = new FormData()
		body.append('email', 'test@example.com')
		body.append('password', 'fakepassword')
		body.append('redirectTo', '/')

		const request = new Request('http://test/login', {
			method: 'POST',
			body,
		})

		const response = await action({ request, context: {}, params: {} })

		expect(response.status).toBe(302)
		expect(response.headers.get('Set-Cookie')).not.toContain('Max-Age=604800')
	})
})
