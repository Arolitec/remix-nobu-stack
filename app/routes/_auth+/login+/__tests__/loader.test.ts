import { authenticator } from '~/utils/auth.server'
import { commitSession, getSession } from '~/utils/session.server'
import loader from '../loader'

describe('[login] loader', () => {
	it('should return an empty response with status 200', async () => {
		const request = new Request('http://test/login')

		const response = await loader({ request, context: {}, params: {} })

		expect(response.status).toBe(200)
		expect(response.json()).resolves.toEqual({})
	})

	it('should redirect to "/" if user is logged in', async () => {
		const session = await getSession('Cookie')
		session.set(authenticator.sessionKey, { id: 1 })

		const request = new Request('http://test/login', {
			headers: {
				Cookie: await commitSession(session),
			},
		})

		const response = await loader({ request, context: {}, params: {} })

		expect(response.status).toBe(302)
		expect(response.headers.get('Location')).toBe('/')
	})
})
