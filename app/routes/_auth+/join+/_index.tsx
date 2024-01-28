import type { MetaFunction } from '@remix-run/node'
import { GeneralErrorBoundary } from '~/components/error-boundary'
import actionFn from './action'
import loaderFn from './loader'
import JoinForm from './components/JoinForm'

export const loader = loaderFn

export const action = actionFn

export const meta: MetaFunction = () => [{ title: 'Sign Up' }]

export default function Join() {
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <JoinForm />
      </div>
    </div>
  )
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />
}
