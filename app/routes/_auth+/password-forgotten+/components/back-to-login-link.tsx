import { Link, useSearchParams } from '@remix-run/react'

export function BackToLoginLink() {
	const [searchParams] = useSearchParams()

	return (
		<div className="flex items-center justify-center pt-8">
			<p className="inline-block  px-2 text-sm text-slate-500">
				Remember your password?{' '}
				<Link
					prefetch="intent"
					className="link text-primary-focus"
					to={{ pathname: '/login', search: searchParams.toString() }}
				>
					Back to login
				</Link>
			</p>
		</div>
	)
}
