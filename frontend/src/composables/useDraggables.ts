import { onUnmounted, ref, toRef } from 'vue'
import type { Ref } from 'vue'
import type { Position } from '@/types/types'
import { useWidgetStore } from '@/stores/useWidgetStore'
import {
	ActionGroup,
	ChangeZIndexAction,
	ImportExpressionToGraphAction,
	isWidgetCovered,
	MoveWidgetAction,
	pushAction,
	ResizeWidgetAction,
} from '@/utils/actions'
import { useSessionStore } from '@/stores/useSessionStore'
import { ExpressionData, GraphData, type Widget } from '@/utils/widgetData'

// PS eventually thsi may need to track pointerID for multi touch in the future PS
// Description: computes a dx and dy for a pointer gesture, giving lifecycle hooks for it's movement
function usePointerDelta(hooks?: {
	onDown?: (event: PointerEvent) => void
	onMove?: (event: PointerEvent, dx: number, dy: number) => void
	onUp?: (event: PointerEvent, finalDx: number, finalDy: number) => void
}) {
	let startX: number
	let startY: number
	let dx: number
	let dy: number

	const isActive = ref(false)
	function start(event: PointerEvent) {
		if (isActive.value) return
		isActive.value = true

		startX = event.clientX
		startY = event.clientY

		document.addEventListener('pointermove', onMove)
		document.addEventListener('pointerup', onUp)
		hooks?.onDown?.(event)
	}
	function onMove(event: PointerEvent) {
		if (!isActive.value) return
		dx = event.clientX - startX
		dy = event.clientY - startY
		hooks?.onMove?.(event, dx, dy)
	}
	function onUp(event: PointerEvent) {
		isActive.value = false

		document.removeEventListener('pointermove', onMove)
		document.removeEventListener('pointerup', onUp)
		hooks?.onUp?.(event, dx, dy)
	}
	onUnmounted(() => {
		document.removeEventListener('pointermove', onMove)
		document.removeEventListener('pointerup', onUp)
	})

	return { start, isActive }
}

export function usePointerGestureCoordinateOffset(
	x: Ref<number>,
	y: Ref<number>,
	hooks?: {
		onDown?: (event: PointerEvent) => void
		onMove?: (event: PointerEvent, dx: number, dy: number) => void
		onUp?: (event: PointerEvent, from: Position, to: Position) => void
	},
) {
	const { start, isActive } = usePointerDelta({ onDown, onMove, onUp })
	let startX: number
	let startY: number

	function onDown(event: PointerEvent) {
		startX = x.value
		startY = y.value
		hooks?.onDown?.(event)
	}
	function onMove(event: PointerEvent, dx: number, dy: number) {
		x.value = startX + dx
		y.value = startY + dy
		hooks?.onMove?.(event, dx, dy)
	}
	function onUp(event: PointerEvent) {
		hooks?.onUp?.(event, { x: startX, y: startY }, { x: x.value, y: y.value })
	}

	return { start, isActive }
}

export function useWidgetDrag(widget: Widget) {
	const widgetStore = useWidgetStore()
	const sessionStore = useSessionStore()
	const x = toRef(widget, 'x')
	const y = toRef(widget, 'y')

	let startZIndex = 0
	let newZIndex = 0

	const { start, isActive: isDragging } = usePointerGestureCoordinateOffset(x, y, {
		onDown: () => {
			sessionStore.heldWidgetId = widget.id
			startZIndex = widget.zIndex
			newZIndex = widgetStore.bringWidgetToFrontSilently(widget)
		},
		onUp: (event, from, to) => {
			const moved = from.x !== to.x || from.y !== to.y
			const zIndexChanged = isWidgetCovered(widget, startZIndex)

			// compute what actions actually happend
			const actionGroup = new ActionGroup([])
			if (moved) {
				actionGroup.push(new MoveWidgetAction(widget, to, from))
			}
			if (zIndexChanged) {
				actionGroup.push(new ChangeZIndexAction(widget, newZIndex, startZIndex))
			}

			// DRAG & DROP onto graphs
			if (widget instanceof ExpressionData) {
				const widgets = widgetStore.getWidgetsFromPoint(event.clientX, event.clientY)
				const graph = widgets.find((widget) => widget instanceof GraphData)

				if (graph) {
					const action = new ImportExpressionToGraphAction(graph, widget)
					action.do()
					actionGroup.push(action)
				}
			}

			if (actionGroup.length > 0) {
				pushAction(actionGroup)
			}

			// not temporary this is important state cleanup
			queueMicrotask(() => (sessionStore.heldWidgetId = ''))
		},
	})

	return { start, isDragging }
}

export function useWidgetResize(widget: Widget) {
	const widgetStore = useWidgetStore()
	const width = toRef(widget, 'width')
	const height = toRef(widget, 'height')

	let startZIndex = 0
	let newZIndex = 0

	const { start, isActive: isResizing } = usePointerGestureCoordinateOffset(width, height, {
		onDown: () => {
			startZIndex = widget.zIndex
			newZIndex = widgetStore.bringWidgetToFrontSilently(widget)
		},
		onUp: (_, from, to) => {
			const fromSize = { width: from.x, height: from.y }
			const toSize = { width: to.x, height: to.y }

			const resized = fromSize.width !== toSize.width || fromSize.height !== toSize.height
			const zIndexChanged = isWidgetCovered(widget, startZIndex)

			// compute what actions actually happend
			const actionGroup = new ActionGroup([])
			if (resized) {
				actionGroup.push(new ResizeWidgetAction(widget, fromSize, toSize))
			}
			if (zIndexChanged) {
				actionGroup.push(new ChangeZIndexAction(widget, newZIndex, startZIndex))
			}
			if (actionGroup.length > 0) {
				pushAction(actionGroup)
			}
		},
	})

	return { start, isResizing }
}
