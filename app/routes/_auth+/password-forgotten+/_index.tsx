import { type MetaFunction } from '@remix-run/node'
import { GeneralErrorBoundary } from '~/components/error-boundary'
import actionFn from './action'
import { BackToLoginLink } from './components/back-to-login-link'
import { PasswordForgottenForm } from './components/password-forgotten-form'
import loaderFn from './loader'

export const loader = loaderFn

export const action = actionFn

export const meta: MetaFunction = () => [{ title: 'Password Forgotten' }]

export default function PasswordForgottenPage() {
	return (
		<div className="flex min-h-full flex-col justify-center">
			<div className="mx-auto w-full max-w-md px-8">
				<h1 className="text-xl inline-block mb-16 before:content-[''] capitalize before:absolute before:-bottom-2 before:left-0 before:w-1/3 before:border before:border-zinc-500 relative">
					Password forgotten
				</h1>

				<PasswordForgottenForm />

				<BackToLoginLink />
			</div>
		</div>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
