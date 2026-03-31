export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value))
}

export async function copy(text: string): Promise<boolean> {
	try {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text)
		} else {
			const textarea = document.createElement('textarea')
			textarea.value = text
			document.body.appendChild(textarea)
			textarea.select()
			document.execCommand('copy')
			document.body.removeChild(textarea)
		}
		return true
	} catch (err) {
		console.error('Copy failed:', err)
		return false
	}
}
