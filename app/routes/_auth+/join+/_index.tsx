import type { MetaFunction } from '@remix-run/node'
import { Link, useSearchParams } from '@remix-run/react'
import { GeneralErrorBoundary } from '~/components/error-boundary'
import actionFn from './action'
import { JoinForm } from './components/join-form'
import loaderFn from './loader'

export const loader = loaderFn

export const action = actionFn

export const meta: MetaFunction = () => [{ title: 'Sign Up' }]

export default function Join() {
	const [searchParams] = useSearchParams()

	return (
		<div className="flex min-h-full flex-col justify-center">
			<div className="mx-auto w-full max-w-md px-8">
				<JoinForm />

				<div className="flex items-center justify-center pt-8">
					<p className="text-center text-sm text-gray-500">
						Already have an account?{' '}
						<Link
							prefetch="intent"
							className="text-accent underline"
							to={{
								pathname: '/login',
								search: searchParams.toString(),
							}}
						>
							Log in
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
