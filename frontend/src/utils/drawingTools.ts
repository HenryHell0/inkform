import { reactive } from 'vue'
import { cropCanvas, downloadCanvasPNG, svgToCanvas, recognizeCanvas } from './svgCanvasUtils'
import { ExpressionData } from './widgetData'
import { erasePathsInRect } from './svgCanvasUtils'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { useCanvasStore } from '@/stores/useCanvasStore'
import { useSessionStore } from '@/stores/useSessionStore'
import { AddPathAction, RemovePathAction } from './actions'
import { DEBUG } from './debug'
import { useHistoryStore } from '@/stores/useHistoryStore'

export interface Tool {
	onDown?: (event: PointerEvent) => void
	onMove?: (event: PointerEvent) => void
	onUp?: () => void
}

const pen = new (class implements Tool {
	onDown(event: PointerEvent) {
		const sessionStore = useSessionStore()
		let startPos = { x: event.offsetX, y: event.offsetY }
		sessionStore.currentStroke = [startPos]
	}
	onMove(event: PointerEvent) {
		const sessionStore = useSessionStore()

		if (sessionStore.inputMode !== 'drawing') return
		let point = { x: event.offsetX, y: event.offsetY }

		sessionStore.currentStroke.push(point)
	}
	onUp() {
		const sessionStore = useSessionStore()
		const historyStore = useHistoryStore()

		const path = { d: sessionStore.currentPath, id: crypto.randomUUID() }
		const action = new AddPathAction(path)
		historyStore.execute(action)

		// clear path
		sessionStore.currentStroke = []
	}
})()
const eraser = new (class implements Tool {
	onMove(event: PointerEvent) {
		const sessionStore = useSessionStore()
		if (sessionStore.inputMode !== 'drawing') return
		const canvasStore = useCanvasStore()

		const startPos = sessionStore.previousMousePos
		const endPos = { x: event.clientX, y: event.clientY }

		const dx = endPos.x - startPos.x
		const dy = endPos.y - startPos.y
		const distance = Math.hypot(dx, dy)
		const steps = Math.max(1, Math.ceil(distance))

		for (let i = 0; i <= steps; i++) {
			const x = startPos.x + (dx / steps) * i
			const y = startPos.y + (dy / steps) * i

			const elements = document.elementsFromPoint(x, y)

			const history = useHistoryStore()

			for (let pathElement of elements) {
				if (!(pathElement instanceof SVGPathElement)) continue

				const id = pathElement.dataset.id
				const path = canvasStore.paths.find((p) => p.id === id)
				if (!path) continue

				const action = new RemovePathAction(path)
				history.execute(action)
			}
		}
	}
})()

//! TODO fix duplicate code
export interface SelectorTool extends Tool {
	readonly x: number
	readonly y: number
	readonly width: number
	readonly height: number
	isActive: boolean
	startX: number
	startY: number
	endX: number
	endY: number
}
export const selector: SelectorTool = reactive(
	new (class implements SelectorTool {
		startX: number
		startY: number
		endX: number
		endY: number
		isActive: boolean
		constructor() {
			this.startX = -1
			this.startY = -1
			this.endX = -1
			this.endY = -1
			this.isActive = false
		}

		get x() {
			return Math.min(this.startX, this.endX)
		}
		get y() {
			return Math.min(this.startY, this.endY)
		}
		get width() {
			return Math.abs(this.endX - this.startX)
		}

		get height() {
			return Math.abs(this.endY - this.startY)
		}

		onDown(event: PointerEvent) {
			this.startY = event.clientY
			this.startX = event.clientX
			this.endX = event.clientX
			this.endY = event.clientY
			this.isActive = true
		}
		onMove(event: PointerEvent) {
			if (!this.isActive) return
			this.endX = event.clientX
			this.endY = event.clientY
		}
		async onUp() {
			const widgetStore = useWidgetStore()
			const sessionStore = useSessionStore()

			// reset

			// convert svg to png!!
			const fullCanvas = await svgToCanvas('inputSVG')
			// crop canvas
			const croppedCanvas = document.createElement('canvas')
			cropCanvas(croppedCanvas, fullCanvas, this.x, this.y, this.width, this.height)

			// erase strokes and switch to pen
			erasePathsInRect(this.x, this.y, this.width, this.height)

			// recognize expression
			const latex = recognizeCanvas(croppedCanvas)

			// add expression widget
			widgetStore.addWidget(new ExpressionData(this.x, this.y, this.width, this.height, latex))
			const widget = widgetStore!.widgets.at(-1)
			if (!(widget instanceof ExpressionData)) return
			widget.latex = await latex // update latex when its done

			// clean up
			this.isActive = false
			sessionStore.activeTool = 'pen'

			// debug stuff
			if (DEBUG.downloadPNG) downloadCanvasPNG(croppedCanvas)
			if (DEBUG.logLatex) console.log(await latex)
		}
	})(),
)

export const toolList = ['pen', 'eraser', 'selector'] as const
export type ToolName = (typeof toolList)[number]
export const tools: Record<ToolName, Tool> = {
	pen: pen,
	eraser: eraser,
	selector: selector,
}
