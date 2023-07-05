import { json, type LoaderArgs } from '@remix-run/node'
import { requireAnonymous } from '~/utils/auth.server'

export const loaderFn = async ({ request }: LoaderArgs) => {
	await requireAnonymous(request)

	return json({})
}
