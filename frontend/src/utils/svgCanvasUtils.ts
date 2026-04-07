import { useCanvasStore } from '@/stores/useCanvasStore.js'
const API_BASE = import.meta.env.VITE_API_BASE

interface Position {
	x: number
	y: number
}

// later add pathToStroke
export function strokeToPath(stroke: Position[]): string {
	if (!stroke.length) return ''

	if (stroke.length === 1) {
		// single point → tiny circle
		const radius = 1
		const p = stroke[0]!
		return `M ${p.x},${p.y - radius} a ${radius} ${radius} 0 1 0 0.0001 0`
	}

	// multiple points → line
	return (
		`M ${stroke[0]!.x},${stroke[0]!.y} ` +
		stroke
			.slice(1)
			.map((p) => `L ${p.x},${p.y}`)
			.join(' ')
	)
}

export function serializeSVG(svgElement: SVGSVGElement): string {
	for (const element of Array.from(svgElement.children)) {
		if (element instanceof SVGElement) {
			const style = getComputedStyle(element)
			element.style.stroke = style.stroke
			element.style.fill = style.fill
			element.style.strokeWidth = style.strokeWidth
		}
	}

	return new XMLSerializer().serializeToString(svgElement)
}
export function cropCanvas(
	finalCanvas: HTMLCanvasElement,
	originalCanvas: HTMLCanvasElement,
	x: number,
	y: number,
	w: number,
	h: number,
) {
	finalCanvas.width = w
	finalCanvas.height = h
	const finalCtx = finalCanvas.getContext('2d')
	if (!finalCtx) throw new Error('could not get context')

	finalCtx.drawImage(originalCanvas, x, y, w, h, 0, 0, w, h)
}

export function downloadCanvasPNG(canvas: HTMLCanvasElement) {
	const URL: string = canvas.toDataURL()
	const downloadLinkElement = document.createElement('a')
	downloadLinkElement.href = URL
	downloadLinkElement.download = 'canvas-screenshot.png'
	document.body.appendChild(downloadLinkElement)
	downloadLinkElement.click()
	document.body.removeChild(downloadLinkElement)
}

export async function svgToCanvas(id: string): Promise<HTMLCanvasElement> {
	return new Promise((resolve, reject) => {
		const svgElement = document.getElementById(id)
		if (!(svgElement instanceof SVGSVGElement)) throw new Error('element is not svgsvgElement')

		// serialize
		const svgString = serializeSVG(svgElement)
		const svgRect = svgElement.getBoundingClientRect()

		// prepare canvas
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		if (!ctx) throw new Error('ctx undefined')

		// create blob
		const blob = new Blob([svgString], { type: 'image/svg+xml' })
		const blobUrl = URL.createObjectURL(blob)

		// load image
		const img = new Image()
		img.src = blobUrl
		img.width = svgRect.width
		img.height = svgRect.height
		img.onerror = reject
		img.onload = () => {
			// draw image to canvas
			canvas.width = img.width
			canvas.height = img.height
			ctx.fillStyle = 'white'
			ctx.fillRect(0, 0, img.width, img.height)
			ctx.drawImage(img, 0, 0)
			URL.revokeObjectURL(img.src)

			resolve(canvas)
		}
	})
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (!blob) {
				reject(new Error('Canvas toBlob() returned null'))
				return
			}
			resolve(blob)
		}, 'image/png')
	})
}

export async function recognizeCanvas(canvas: HTMLCanvasElement): Promise<string> {
	const blob = await canvasToBlob(canvas)
	const formData = new FormData()
	formData.append('img', blob, 'image.png')

	const response = await fetch(`${API_BASE}/predict`, {
		method: 'POST',
		body: formData,
	})
	const latex = await response.text()

	return latex
}

export function getPathsInRect(x: number, y: number, width: number, height: number) {
	const canvasStore = useCanvasStore()
	// this function also deletes something if you intersect the edge of a bbox, so it can erase things even if you aren't over it completely - especially if it is a diagonal.

	const rectLeft = x
	const rectRight = x + width
	const rectTop = y
	const rectBottom = y + height

	return canvasStore.paths.filter((path) => {
		const element = document.querySelector(`[data-id="${path.id}"]`)
		if (!element) return true
		if (!(element instanceof SVGPathElement)) return true

		const bbox = element.getBBox()
		const boxLeft = bbox.x
		const boxRight = bbox.x + bbox.width
		const boxTop = bbox.y
		const boxBottom = bbox.y + bbox.height

		// fully inside
		const fullyInside =
			boxLeft >= rectLeft && boxRight <= rectRight && boxTop >= rectTop && boxBottom <= rectBottom

		// partial overlap
		const intersects = !(
			boxRight < rectLeft ||
			boxLeft > rectRight ||
			boxBottom < rectTop ||
			boxTop > rectBottom
		)

		// selection fully inside path bbox (path contains selection)
		const containsSelection =
			rectLeft >= boxLeft && rectRight <= boxRight && rectTop >= boxTop && rectBottom <= boxBottom

		// erase if fully inside or intersecting, but not if it contains selection
		const inRect = (fullyInside || intersects) && !containsSelection

		return inRect
	})
}
