import { json, redirect, type LoaderArgs } from '@remix-run/node'
import { getUserId } from '~/session.server'

export const loaderFn = async ({ request }: LoaderArgs) => {
	const userId = await getUserId(request)
	if (userId) return redirect('/')
	return json({})
}
