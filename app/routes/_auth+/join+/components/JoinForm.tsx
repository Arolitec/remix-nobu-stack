import { Button } from '#/button'
import { Input } from '#/input'
import { Label } from '#/label'
import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import { useState } from 'react'
import InputError from '~/components/input-error'
import useSubmitting from '~/hooks/submit'
import { clientSchema, type Action } from '../action'
import { useRedirectTo } from '../hooks/redirect'

export default function JoinForm() {
	const [searchParams] = useSearchParams()
	const redirectTo = useRedirectTo()
	const lastSubmission = useActionData<Action>()
	const isSubmitting = useSubmitting()

	const [showPassword, setShowPassword] = useState(false)

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
			<div className="form-control">
				<Label htmlFor={email.id}>Email address</Label>
				<div className="mt-1">
					<Input
						{...conform.input(email, {
							type: 'email',
						})}
						autoFocus={true}
						autoComplete="email"
					/>
					<InputError field={email} />
				</div>
			</div>

			<div className="form-control">
				<Label htmlFor={password.id}>Password</Label>
				<div className="mt-1">
					<div className="w-full relative">
						<Input
							{...conform.input(password, {
								type: showPassword ? 'text' : 'password',
							})}
							autoComplete="new-password"
						/>
						<Button
							type="button"
							variant="ghost"
							onClick={e => setShowPassword(prev => !prev)}
							className="absolute right-0 top-0 bottom-0"
						>
							{showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
						</Button>
					</div>
					<InputError field={password} />
				</div>
			</div>

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
