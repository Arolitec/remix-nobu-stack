import { useLocation, useMatches } from '@remix-run/react'
import * as Sentry from '@sentry/remix'
import chalk from 'chalk'
import { useEffect } from 'react'
import { prisma } from './db.server'

export function initClient() {
	Sentry.init({
		dsn: '',
		integrations: [
			new Sentry.BrowserTracing({
				routingInstrumentation: Sentry.remixRouterInstrumentation(
					useEffect,
					useLocation,
					useMatches,
				),
			}),
			// Replay is only available in the client
			new Sentry.Replay(),
		],

		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0,

		// Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
		tracePropagationTargets: ['localhost' /*YOUR_DOMAIN_HERE*/],

		// Capture Replay for 10% of all sessions,
		// plus for 100% of sessions with an error
		replaysSessionSampleRate: 0.1,
		replaysOnErrorSampleRate: 1.0,
	})
}

export function initServer() {
	Sentry.init({
		dsn: '',

		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0,

		// Capture Prisma errors with sentry
		integrations: [new Sentry.Integrations.Prisma({ client: prisma })],
	})
}
