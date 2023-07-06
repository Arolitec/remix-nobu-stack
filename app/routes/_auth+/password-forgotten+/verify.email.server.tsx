import {
	Button,
	Container,
	Hr,
	Html,
	Preview,
	Section,
	Text,
	Tailwind,
	Font,
	Head,
} from '@react-email/components'
import tailwindConfig from '../../../../tailwind.config'

interface VerifyEmailProps {
	otp: string
	verifyLink: string
}

export default function VerifyEmail(props: VerifyEmailProps) {
	const { otp, verifyLink } = props

	return (
		<Tailwind config={tailwindConfig}>
			<Html lang="en" data-theme="light">
				<Head>
					<Font fontFamily="Nunito Sans" fallbackFontFamily="Verdana" />
				</Head>
				<Preview>Nobu Stack - Email Verification</Preview>
				<Container>
					<Section className="flex w-full items-center justify-center">
						<Text className="text-2xl font-bold uppercase">
							Email verification
						</Text>
					</Section>

					<Section>
						<Text className="text-base">
							Here is your verification code:{' '}
							<code className="font-semibold tracking-wider">{otp}</code>,
						</Text>
						<Text className="text-base">
							or, you can click the button below
						</Text>
					</Section>

					<Section className="my-4 flex items-center justify-center">
						<Button href={verifyLink} className="btn-primary btn ">
							Verify email
						</Button>
					</Section>

					<Hr />
					<Text className="text-base">
						All rights reserved. {new Date().getFullYear()}
					</Text>
				</Container>
			</Html>
		</Tailwind>
	)
}
