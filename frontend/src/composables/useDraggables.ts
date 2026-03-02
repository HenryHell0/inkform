import { onUnmounted, ref, toRef } from 'vue'
import type { Ref } from 'vue'
import type { Position, Size } from '@/types/types'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { clamp } from '@/utils/utils'
import { executeAction, MoveWidgetAction, ResizeWidgetAction } from '@/utils/actions'

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
	const widget = widgetStore.getWidgetById(id)
	const x = toRef(widget, 'x')
	const y = toRef(widget, 'y')

	const { start, isActive: isDragging } = usePointerGestureCoordinateOffset(x, y, {
		onMove: () => {
			const maxX = window.innerWidth - widget.width // temporary window.innerWidth and stuff
			const maxY = window.innerHeight - widget.height

			x.value = clamp(x.value, 0, maxX)
			y.value = clamp(y.value, 0, maxY)
		},

		onUp: (_, from, to) => {
			if (from.x === to.x && from.y === to.y) return

			executeAction(new MoveWidgetAction(id, from, to))
		},
	})

	return { start, isDragging }
}

export function useWidgetResize(id: string) {
	const widgetStore = useWidgetStore()
	const widget = widgetStore.getWidgetById(id)
	const width = toRef(widget, 'width')
	const height = toRef(widget, 'height')

	const { start, isActive: isResizing } = usePointerGestureCoordinateOffset(width, height, {
		onMove: () => {
			const maxWidth = window.innerWidth // "temporary" window.innerWidth (actually temporary - it doesent work) :)
			const maxHeight = window.innerHeight

			width.value = clamp(width.value, 100, maxWidth) // todo fix minimum width and height
			height.value = clamp(height.value, 100, maxHeight)
		},

		onUp: (_, from, to) => {
			if (from.x === to.x && from.y === to.y) return

			executeAction(
				new ResizeWidgetAction(id, { width: from.x, height: from.y }, { width: to.x, height: to.y }), // can I make this less ugly
			)
		},
	})

	return { start, isResizing }
}
