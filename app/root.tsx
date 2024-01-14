import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'

import rdtStylesheet from 'remix-development-tools/index.css'
import { getUser } from '~/utils/auth.server'
import appStylesHref from './styles/app.css?inline'
import tailwindStylesHref from './styles/tailwind.css?inline'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: tailwindStylesHref },
	{ rel: 'stylesheet', href: appStylesHref },
	...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
	...(process.env.NODE_ENV === 'development'
		? [{ rel: 'stylesheet', href: rdtStylesheet }]
		: []),
]

export const loader = async ({ request }: LoaderFunctionArgs) => {
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

let AppExport = App

if (process.env.NODE_ENV === 'development') {
	const { withDevTools } = require('remix-development-tools')
	AppExport = withDevTools(AppExport)
}

export default AppExport
