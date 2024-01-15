import type { User } from '@prisma/client'
import { render } from '@react-email/components'
import { Queue } from 'quirrel/remix'
import { sendMail } from '~/utils/mailer.server'
import WelcomeEmail from './welcome.email.server'

export default Queue(
	'queues/welcome-mail/send-welcome-mail',
	async (user: User) => {
		const html = render(<WelcomeEmail username={user.email} />)

		await sendMail(user.email, 'Welcome to my app!', html)
	},
	{ retry: ['1min', '5min', '10min'] },
)
