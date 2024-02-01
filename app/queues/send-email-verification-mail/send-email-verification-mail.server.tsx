import { render } from '@react-email/render'
import { Queue } from 'quirrel/remix'
import { sendMail } from '~/utils/mailer.server'
import VerifyEmail from './verify.email.server'

export default Queue<{ email: string; otp: string; verifyLink: string }>(
	'queues/send-email-verification-mail',
	async data => {
		const html = render(<VerifyEmail {...data} />)
		const subject = 'Email verification'

		await sendMail(data.email, subject, html)
	},
	{ retry: ['1min', '5min', '10min'] },
)
