import { useForm, conform } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import { useSearchParams, useActionData, Form, Link } from "@remix-run/react"
import { useState } from "react"
import { clientSchema, type Action } from "../action"
import { useRedirectTo } from "../hooks/redirect"
import useSubmitting from "~/hooks/submit"

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
        <label htmlFor={email.id} className="label">
          <span className="label-text">Email address</span>
        </label>
        <div className="mt-1">
          <input
            {...conform.input(email, {
              type: 'email',
              ariaAttributes: true,
            })}
            required
            autoFocus={true}
            autoComplete="email"
            className={`input-bordered input w-full ${email.error ? 'input-error' : ''
              }`}
          />
          {!!email.error && (
            <div className="pt-1 text-sm text-error" id={email.errorId}>
              {email.error}
            </div>
          )}
        </div>
      </div>

      <div className="form-control">
        <label htmlFor={password.id} className="label">
          <span className="label-text">Password</span>
        </label>
        <div className="mt-1">
          <div className="join w-full">
            <input
              {...conform.input(password, {
                type: showPassword ? 'text' : 'password',
                ariaAttributes: true,
              })}
              autoComplete="new-password"
              className={`input-bordered input join-item w-full ${password.error ? 'input-error' : ''
                }`}
            />
            <button
              type="button"
              onClick={e => setShowPassword(prev => !prev)}
              className="join-item btn min-w-[5rem]"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {!!password.error && (
            <div className="pt-1 text-sm text-error" id={password.errorId}>
              {password.error}
            </div>
          )}
        </div>
      </div>

      <input
        type="hidden"
        name="redirectTo"
        value={redirectTo ?? undefined}
      />
      <button
        type="submit"
        className="btn-primary btn w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Please wait...' : 'Create Account'}
      </button>
      <div className="flex items-center justify-center pt-8">
        <div className="text-center text-sm text-gray-500">
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
        </div>
      </div>
    </Form>
  )
}
