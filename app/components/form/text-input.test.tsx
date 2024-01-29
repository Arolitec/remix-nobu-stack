import type { FieldConfig } from '@conform-to/react'
import { render, screen } from '~/utils/test'
import TextInput from './text-input'

describe('TextInput', () => {
	const mockField = { name: 'email' } satisfies FieldConfig<string>
	const label = 'Email address'

	it('should render', async () => {
		render(<TextInput field={mockField} label={label} />)

		await screen.findByRole('textbox')

		expect(screen.getByRole('textbox')).toBeInTheDocument()
	})

	it('should render the label', async () => {
		render(<TextInput field={mockField} label={label} />)

		await screen.findByText(label)

		expect(screen.getByText(label)).toBeInTheDocument()
	})
})
