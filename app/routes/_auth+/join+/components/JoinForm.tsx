import { Button } from '#/button'
import { useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import PasswordInput from '~/components/form/password-input'
import FormTextInput from '~/components/form/text-input'
import useSubmitting from '~/hooks/submit'
import { clientSchema, type Action } from '../action'
import { useRedirectTo } from '../hooks/redirect'

export default function JoinForm() {
	const [searchParams] = useSearchParams()
	const redirectTo = useRedirectTo()
	const lastSubmission = useActionData<Action>()
	const isSubmitting = useSubmitting()

	const [form, { email, password }] = useForm({
		constraint: getFieldsetConstraint(clientSchema),
		lastSubmission,
		onValidate({ formData }) {
			return parse(formData, { schema: clientSchema })
		},
		id: 'join-form',
		shouldRevalidate: 'onBlur',
	})

	return (
		<Form method="post" className="space-y-6" {...form.props}>
			<FormTextInput label="Email address" field={email} />

			<PasswordInput label="Password" field={password} />

			<input type="hidden" name="redirectTo" value={redirectTo ?? undefined} />

			<Button
				type="submit"
				variant="default"
				className="w-full"
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Please wait...' : 'Create Account'}
			</Button>

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
		</Form>
	)
}
