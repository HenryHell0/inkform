import {  onUnmounted, ref, toRef } from 'vue'
import type { Ref } from 'vue'
import type { Position, Size } from '@/types/types'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { clamp } from '@/utils/utils'
import { executeAction, MoveWidgetAction } from '@/utils/actions'

// PS eventually thsi may need to track pointerID for multi touch in the future PS
function usePointerDelta(hooks?: {
	onDown?: (event: PointerEvent) => void
	onMove?: (event: PointerEvent, dx: number, dy: number) => void
	onUp?: (event: PointerEvent) => void
}) {
	let startX = 0
	let startY = 0
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
		const dx = event.clientX - startX
		const dy = event.clientY - startY
		hooks?.onMove?.(event, dx, dy)
	}
	function onUp(event: PointerEvent) {
		isActive.value = false

		document.removeEventListener('pointermove', onMove)
		document.removeEventListener('pointerup', onUp)
		hooks?.onUp?.(event)
	}
	onUnmounted(() => {
		document.removeEventListener('pointermove', onMove)
		document.removeEventListener('pointerup', onUp)
	})

	return { start, isActive }
}

// useDrag and useResize are actually identical functions, except their returns and arguments are renamed
export function useDrag(
	x: Ref<number>,
	y: Ref<number>,
	hooks?: {
		onDown?: (event: PointerEvent) => void
		onMove?: (event: PointerEvent, dx: number, dy: number) => void
		onUp?: (event: PointerEvent, from: Position, to: Position) => void
	},
) {
	const { start, isActive: isDragging } = usePointerDelta({ onDown, onMove, onUp })
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

	return { start, isDragging }
}

export function useResize(
	width: Ref<number>,
	height: Ref<number>,
	hooks?: {
		onDown?: (event: PointerEvent) => void
		onMove?: (event: PointerEvent, dx: number, dy: number) => void
		onUp?: (event: PointerEvent, from: Size, to: Size) => void
	},
) {
	const { start, isActive: isResizing } = usePointerDelta({ onDown, onMove, onUp })
	let startWidth: number
	let startHeight: number

	function onDown(event: PointerEvent) {
		startWidth = width.value
		startHeight = height.value
		hooks?.onDown?.(event)
	}
	function onMove(event: PointerEvent, dx: number, dy: number) {
		width.value = startWidth + dx
		height.value = startHeight + dy
		hooks?.onMove?.(event, dx, dy)
	}
	function onUp(event: PointerEvent) {
		hooks?.onUp?.(
			event,
			{ width: startWidth, height: startHeight },
			{ width: width.value, height: height.value },
		)
	}

	return { start, isResizing }
}

export function useWidgetDrag(id: string) {
	const widgetStore = useWidgetStore()
	const widget = widgetStore.getWidgetById(id)
	const x = toRef(widget, 'x')
	const y = toRef(widget, 'y')

	const { start, isDragging } = useDrag(x, y, {
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
