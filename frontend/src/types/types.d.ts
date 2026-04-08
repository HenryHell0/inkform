export interface Position {
	x: number
	y: number
}

export interface Size {
	width: number
	height: number
}

export interface Path {
	d: string
	id: string
}

declare global {
	interface Window {
		gtag: (string, string, ...args: any[]) => void
	}
}

export {}
