import type { User } from '@prisma/client'
import { render } from '@react-email/components'
import { Queue } from 'quirrel/remix'
import { sendMail } from '~/utils/mailer.server'
import WelcomeEmail from './welcome.email.server'

export default Queue<User>(
	'queues/send-welcome-email',
	async user => {
		const html = render(<WelcomeEmail username={user.email} />)
		const subject = 'Welcome to Nobu Stack'

		await sendMail(user.email, subject, html)
		console.log(`Sent welcome email to ${user.email}`)
	},
	{ retry: ['1min', '5min', '10min'] },
)