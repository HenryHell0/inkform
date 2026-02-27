import { onUnmounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useSessionStore } from '@/stores/useSessionStore.js'

// PS eventually thsi may need to track pointerID for multi touch in the future PS
function usePointerDelta(hooks?: {
	onDown?: (event: PointerEvent) => void
	onMove?: (dx: number, dy: number, event: PointerEvent) => void
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
		hooks?.onMove?.(dx, dy, event)
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

export function useDrag(elementX: Ref<number>, elementY: Ref<number>) {
	const { start, move, end, deltaX, deltaY, moving: isDragging } = useMouseDelta()

	let initialElementX: number
	let initialElementY: number

	function dragStart(event: PointerEvent) {
		start(event)

		initialElementX = elementX.value
		initialElementY = elementY.value
	}

	function dragMove(event: PointerEvent) {
		if (!move(event)) return false

		elementX.value = initialElementX + deltaX.value
		elementY.value = initialElementY + deltaY.value

		return true
	}

	function dragEnd() {
		end()
	}

	return { dragStart, dragMove, dragEnd, isDragging }
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
