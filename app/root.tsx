import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'

import { getUser } from '~/utils/auth.server'
import tailwindStylesHref from './styles/tailwind.css'
import appStylesHref from './styles/app.css'
import { withSentry } from '@sentry/remix'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: tailwindStylesHref },
	{ rel: 'stylesheet', href: appStylesHref },
	...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export const loader = async ({ request }: LoaderArgs) => {
	return json({ user: await getUser(request) } as const)
}

function App() {
	return (
		<html lang="en" className="h-full">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="h-full">
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}

export default withSentry(App, { wrapWithErrorBoundary: false })
