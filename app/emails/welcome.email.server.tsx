import {
	Body,
	Button,
	Container,
	Font,
	Head,
	Hr,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components'
import tailwindConfig from '../../tailwind.config'

interface WelcomeEmailProps {
	username: string
}

export default function WelcomeEmail(props: Readonly<WelcomeEmailProps>) {
	const { username } = props

	return (
		<Html lang="en" data-theme="light">
			<Preview>Welcome to Nobu Stack</Preview>
			<Tailwind config={tailwindConfig}>
				<Head>
					<Font fontFamily="Nunito Sans" fallbackFontFamily="Verdana" />
				</Head>
				<Body>
					<Container>
						<Section className="flex w-full items-center justify-center">
							<Text className="text-4xl font-bold uppercase">Nobu Stack</Text>
						</Section>
						<Section>
							<Text className="text-base">Hi {username},</Text>
							<Text className="text-base">
								Welcome to Nobu Stack. We hope you will like it!
							</Text>
						</Section>
						<Section className="my-4 flex items-center justify-center">
							<Button
								href="http://localhost:3000/login"
								className="btn-primary btn "
							>
								Get started
							</Button>
						</Section>
						<Text className="text-base">
							Best,
							<br />
							Arolitec Team
						</Text>
						<Hr />
						<Text className="text-base">
							All rights reserved. {new Date().getFullYear()}
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
