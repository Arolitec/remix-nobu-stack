import { Button } from '#/button'
import { Input } from '#/input'
import { Label } from '#/label'
import { conform, type FieldConfig } from '@conform-to/react'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { useCallback, useState } from 'react'
import FieldError from '~/components/form/field-error'

interface Props {
	label: string
	field: FieldConfig<string>
}

export default function PasswordInput({ label, field }: Readonly<Props>) {
	const [showPassword, togglePassword] = useToggle()

	return (
		<div className="mb-2">
			<Label htmlFor={field.id}>Password</Label>
			<div className="mt-1">
				<div className="w-full relative">
					<Input
						{...conform.input(field, {
							type: showPassword ? 'text' : 'password',
						})}
						autoComplete="new-password"
					/>
					<Button
						type="button"
						variant="ghost"
						onClick={togglePassword}
						className="absolute right-0 top-0 bottom-0"
					>
						{showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
					</Button>
				</div>
				<FieldError field={field} />
			</div>
		</div>
	)
}

function useToggle() {
	const [value, setValue] = useState(false)

	const toggleValue = useCallback(() => {
		setValue(prev => !prev)
	}, [])

	return [value, toggleValue] as const
}
