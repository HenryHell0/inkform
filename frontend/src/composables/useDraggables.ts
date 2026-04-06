import { onUnmounted, ref, toRef } from 'vue'
import type { Ref } from 'vue'
import type { Position, Size } from '@/types/types'
import { useWidgetStore } from '@/stores/useWidgetStore'
import {
	ActionGroup,
	BringWidgetToFrontAction,
	isWidgetCovered,
	MoveWidgetAction,
	pushAction,
	ResizeWidgetAction,
} from '@/utils/actions'
import { useSessionStore } from '@/stores/useSessionStore'

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

// todo rename
// usepointermove, usepointergesture, usedrag, .... idk
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

export function useWidgetDrag(id: string) {
	const widgetStore = useWidgetStore()
	const sessionStore = useSessionStore()
	const widget = widgetStore.getWidgetById(id)
	const x = toRef(widget, 'x')
	const y = toRef(widget, 'y')

	let startZIndex = 0
	let newZIndex = 0

	const { start, isActive: isDragging } = usePointerGestureCoordinateOffset(x, y, {
		onDown: () => {
			sessionStore.heldWidgetId = id
			startZIndex = widget.zIndex
			newZIndex = widgetStore.bringWidgetToFrontSilently(widget)
		},
		onUp: (event, from, to) => {
			const moved = from.x !== to.x || from.y !== to.y
			const zIndexChanged = isWidgetCovered(widget, startZIndex)

			// compute what actions actually happend
			if (moved && zIndexChanged) {
				pushAction(
					new ActionGroup([
						new MoveWidgetAction(id, to, from),
						new BringWidgetToFrontAction(widget), // TEST from changeZIndexAction
					]),
				)
			} else if (moved) {
				pushAction(new MoveWidgetAction(id, to, from))
			} else if (zIndexChanged) {
				pushAction(new BringWidgetToFrontAction(widget)) // TEST from changeZIndexAction
			}

			// * TEMPORARY EVIL HACKY DRAG AND DROP FIX
			const elements = document.elementsFromPoint(event.clientX, event.clientY)
			const dropTarget = elements.find(
				(el) => el instanceof HTMLElement && el.hasAttribute('data-drop-type'),
			) as HTMLElement
			if (dropTarget?.dataset.dropType === 'graph') {
				dropTarget.dispatchEvent(new CustomEvent('widget-drop'))
			}

			// not temporary this is important state cleanup
			queueMicrotask(() => (sessionStore.heldWidgetId = ''))
		},
	})

	return { start, isDragging }
}

export function useWidgetResize(id: string) {
	const widgetStore = useWidgetStore()
	const widget = widgetStore.getWidgetById(id)
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
			const fromSize: Size = { width: from.x, height: from.y }
			const toSize: Size = { width: to.x, height: to.y }

			const resized = fromSize.width !== toSize.width || fromSize.height !== toSize.height
			const zIndexChanged = isWidgetCovered(widget, startZIndex)

			// compute what actions actually happend
			if (resized && zIndexChanged) {
				pushAction(
					new ActionGroup([
						new ResizeWidgetAction(id, fromSize, toSize),
						new BringWidgetToFrontAction(widget), // TEST from changeZIndexAction
					]),
				)
			} else if (resized) {
				pushAction(new ResizeWidgetAction(id, fromSize, toSize))
			} else if (zIndexChanged) {
				pushAction(new BringWidgetToFrontAction(widget)) // TEST from changeZIndexAction
			}
		},
	})

	return { start, isResizing }
}
