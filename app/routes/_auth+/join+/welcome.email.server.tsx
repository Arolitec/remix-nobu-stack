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

interface WelcomeEmailProps {
	username: string
}

export default function WelcomeEmail(props: WelcomeEmailProps) {
	const { username } = props

	return (
		<Tailwind config={tailwindConfig}>
			<Html lang="en" data-theme="light">
				<Head>
					<Font fontFamily="Nunito Sans" fallbackFontFamily="Verdana" />
				</Head>
				<Preview>Welcome to Nobu Stack.</Preview>
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
			</Html>
		</Tailwind>
	)
}
