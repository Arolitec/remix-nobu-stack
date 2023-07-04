import { json, redirect, type LoaderArgs } from '@remix-run/node'
import { getUserId } from '~/utils/auth.server'

export const loaderFn = async ({ request }: LoaderArgs) => {
	const userId = await getUserId(request)
	if (userId) return redirect('/')
	return json({})
}
