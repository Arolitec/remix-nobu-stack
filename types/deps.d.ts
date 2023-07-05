declare module 'thirty-two' {
	export function encode(data: string | Buffer): string
	export function decode(data: string): Buffer
}
