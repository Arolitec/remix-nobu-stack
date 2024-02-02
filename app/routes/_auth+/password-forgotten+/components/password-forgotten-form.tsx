import { useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { CheckCircledIcon } from '@radix-ui/react-icons'
import { Link, useFetcher, useSearchParams } from '@remix-run/react'
import LoadingButton from '~/components/form/loading-button'
import TextInput from '~/components/form/text-input'
import { schema, type Action } from '../action'

export function PasswordForgottenForm() {
	const [searchParams] = useSearchParams()
	const passwordForgotten = useFetcher<Action>()

	const lastSubmission = passwordForgotten.data
		? passwordForgotten.data.submission
		: undefined

	const [form, { email }] = useForm({
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
		onValidate({ formData }) {
			return parse(formData, { schema })
		},
		shouldRevalidate: 'onBlur',
		id: 'password-forgotten-form',
	})

	const isSubmitting = ['submitting'].includes(passwordForgotten.state)

	return (
		<>
			{passwordForgotten.state === 'idle' && !passwordForgotten.data?.ok ? (
				<passwordForgotten.Form
					method="POST"
					className="space-y-6"
					action="."
					{...form.props}
				>
					<TextInput
						label="Email address"
						field={email}
						InputProps={{ autoFocus: true, autoComplete: 'email' }}
					/>

					<LoadingButton
						type="submit"
						disabled={isSubmitting}
						loading={isSubmitting}
						className="w-full"
					>
						{isSubmitting ? 'Please wait...' : 'Send verification mail'}
					</LoadingButton>

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
				</passwordForgotten.Form>
			) : (
				<div className="alert alert-success">
					<CheckCircledIcon className="h-[2rem] w-[2rem]" role="img" />
					<span>
						We have sent you an e-mail with instructions to reset your password.
					</span>
				</div>
			)}
		</>
	)
}
