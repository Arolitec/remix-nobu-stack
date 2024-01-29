import { Input } from '#/input'
import { Label } from '#/label'
import type { FieldConfig } from '@conform-to/react'
import { conform } from '@conform-to/react'
import InputError from '~/components/input-error'

interface Props {
	label: string
	field: FieldConfig<string>
}

export default function FormTextInput({ label, field }: Readonly<Props>) {
	return (
		<div className="mb-2">
			<Label htmlFor={field.id}>{label}</Label>
			<div className="mt-1">
				<Input
					{...conform.input(field, {
						type: 'email',
					})}
					autoFocus={true}
					autoComplete="email"
				/>
				<InputError field={field} />
			</div>
		</div>
	)
}
