import { isRouteErrorResponse, useRouteError } from '@remix-run/react'

const isProduction = process.env.NODE_ENV === 'production'

type Props = {
	routeErrorRenderer?: (error: {
		status: number
		statusText: string
		data: any
		error?: Error
	}) => JSX.Element
	errorRenderer?: (error: Error) => JSX.Element
	unknownErrorRenderer?: (error: unknown) => JSX.Element
}

export function GeneralErrorBoundary({
	routeErrorRenderer = error => (
		<div className="mx-auto flex max-h-full w-full max-w-md flex-col justify-center pt-16">
			<div className="alert alert-error flex justify-start text-xl">
				<span className="font-semibold">{error.status}</span> -
				<span>{error.statusText}</span>
			</div>
		</div>
	),
	errorRenderer = error => (
		<div className="mx-auto flex w-fit flex-col items-start justify-center break-words pt-16">
			{!isProduction && (
				<h1 className="py-2 text-2xl font-semibold">{error.message}</h1>
			)}
			<div className="alert alert-warning flex flex-col items-start">
				{!isProduction ? (
					<>
						<pre className="text-xs">{error.stack}</pre>
					</>
				) : (
					<span className="text-lg font-semibold">
						An error occurred while rendering. Please try again later
					</span>
				)}
			</div>
		</div>
	),
	unknownErrorRenderer = error => (
		<div>
			<div className="alert alert-error">
				<span>Unknown Error</span>
			</div>
		</div>
	),
}: Props) {
	const error = useRouteError()

	return isRouteErrorResponse(error)
		? routeErrorRenderer(error)
		: error instanceof Error
		? errorRenderer(error)
		: unknownErrorRenderer(error)
}
