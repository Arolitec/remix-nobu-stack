import { Link } from '@remix-run/react'

export function PasswordForgottenLink() {
	return (
		<label className="label justify-end">
			<span className="label-text-alt">
				Password forgotten?{' '}
				<Link
					prefetch="intent"
					className="link-secondary link"
					to="/password-forgotten"
				>
					Reset
				</Link>
			</span>
		</label>
	)
}
