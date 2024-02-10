import {
	Body,
	Button,
	Container,
	Font,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components'

interface VerifyEmailProps {
	otp: string
	verifyLink: string
}

export default function VerifyEmail(props: Readonly<VerifyEmailProps>) {
	const { otp, verifyLink } = props

	return (
		<Html lang="en">
			<Head>
				<Font
					fontFamily="Nunito Sans"
					fallbackFontFamily="Verdana"
					webFont={{
						url: 'https://fonts.gstatic.com/s/nunitosans/v15/pe0TMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfUVwoNnq4CLz0_upHZPYsZ51Q42ptCprt4R-tQKr51pE8.woff2',
						format: 'woff2',
					}}
				/>
			</Head>
			<Preview>Nobu Stack - Email Verification</Preview>
			<Tailwind>
				<Body className="bg-white my-auto mx-auto px-2 ">
					<Container className="border border-zinc-200 border-solid  px-4 text-sm my-10 max-w-96 rounded">
						<Heading className="text-xl font-semibold text-center my-8">
							Email verification
						</Heading>

						<Text className="text-base leading-relaxed">
							Here is your verification code: {otp}
						</Text>
						<Text className="text-base">
							or, you can click the button below
						</Text>

						<Section className="my-8 text-center">
							<Button
								href={verifyLink}
								className=" bg-zinc-900 text-zinc-50 whitespace-nowrap rounded-md text-sm font-medium h-4 px-4 py-2"
							>
								Verify email
							</Button>
						</Section>

						<Hr />
						<Text className="text-sm text-zinc-400 font-light text-center">
							All rights reserved. {new Date().getFullYear()}
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
