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

export function useResize(elementWidth: Ref<number>, elementHeight: Ref<number>) {
	const { start, move, end, deltaX, deltaY, moving: isResizing } = useMouseDelta()
	let initialWidth: number
	let initialHeight: number

	function resizeStart(event: PointerEvent) {
		start(event)
		initialWidth = elementWidth.value
		initialHeight = elementHeight.value
	}

	function resizeMove(event: PointerEvent) {
		if (!move(event)) return

		elementWidth.value = initialWidth + deltaX.value
		elementHeight.value = initialHeight + deltaY.value
	}

	function resizeEnd() {
		end()
	}

	return {
		resizeStart,
		resizeMove,
		resizeEnd,
		isResizing,
	}
}
