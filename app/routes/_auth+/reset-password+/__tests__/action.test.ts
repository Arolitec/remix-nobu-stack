import type { User } from '@prisma/client'
import { prisma } from '~/utils/db.server'
import { buildFormData } from '~/utils/form-data'
import { commitSession, getSession } from '~/utils/session.server'
import action from '../action'
import { RESET_PASSWORD_SESSION_KEY } from '../constants'

vi.mock('~/utils/db.server', () => ({
	prisma: {
		user: {
			resetPassword: vi.fn(),
		},
	},
}))

describe.concurrent('[reset-password] action', () => {
	const mockedResetPassword = vi.mocked(prisma.user.resetPassword)

	it('should redirect to "/login" after updating password', async () => {
		const body = buildFormData({
			password: 'password',
			passwordConfirm: 'password',
		})

		const session = await getSession()
		session.set(RESET_PASSWORD_SESSION_KEY, 'test@example.com')

		const request = new Request('http://test.com/reset-password', {
			method: 'POST',
			body,
			headers: {
				Cookie: await commitSession(session),
			},
		})

		mockedResetPassword.mockResolvedValueOnce({ id: '123' } as User)

		const response = await action({ request, context: {}, params: {} })

		expect(response).toBeInstanceOf(Response)
		expect(response.status).toBe(302)
		expect(response.headers.get('Location')).toBe('/login')
		expect(response.headers.get('Set-Cookie')).toContain('_session')
	})

	it('should return 400 if password does not match', async () => {
		const body = buildFormData({
			password: 'password',
			passwordConfirm: 'password1',
		})

		const session = await getSession()

		const request = new Request('http://test.com/reset-password', {
			method: 'POST',
			body,
			headers: {
				Cookie: await commitSession(session),
			},
		})

		const response = await action({ request, context: {}, params: {} })

		expect(response).toBeInstanceOf(Response)
		expect(response.status).toBe(400)
	})

	it('should return 400 if email is not found in session', async () => {
		const body = buildFormData({
			password: 'password',
			passwordConfirm: 'password',
		})

		const request = new Request('http://test.com/reset-password', {
			method: 'POST',
			body,
			headers: {
				Cookie: await commitSession(await getSession()),
			},
		})

		const response = await action({ request, context: {}, params: {} })

		expect(response.status).toBe(302)
	})
})
