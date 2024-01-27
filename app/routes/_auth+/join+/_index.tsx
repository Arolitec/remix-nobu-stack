import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import type { MetaFunction } from '@remix-run/node'
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from '@remix-run/react'
import { useId, useState } from 'react'

import { GeneralErrorBoundary } from '~/components/error-boundary'
import actionFn, { clientSchema } from './action'
import { useRedirectTo } from './hooks/redirect'
import loaderFn from './loader'

export const loader = loaderFn

export const action = actionFn

export const meta: MetaFunction = () => [{ title: 'Sign Up' }]

export default function Join() {
  const id = useId()
  const [searchParams] = useSearchParams()
  const redirectTo = useRedirectTo()
  const lastSubmission = useActionData<typeof action>()
  const [form, { email, password }] = useForm({
    constraint: getFieldsetConstraint(clientSchema),
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema: clientSchema })
    },
    id,
    shouldRevalidate: 'onBlur',
  })
  const { state } = useNavigation()

  const isSubmitting = ['loading', 'submitting'].includes(state)

  const [showPass, setShowPass] = useState(false)

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
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
                    type: showPass ? 'text' : 'password',
                    ariaAttributes: true,
                  })}
                  autoComplete="new-password"
                  className={`input-bordered input join-item w-full ${password.error ? 'input-error' : ''
                    }`}
                />
                <button
                  type="button"
                  onClick={e => setShowPass(prev => !prev)}
                  className="join-item btn min-w-[5rem]"
                >
                  {showPass ? 'Hide' : 'Show'}
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
      </div>
    </div>
  )
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />
}
