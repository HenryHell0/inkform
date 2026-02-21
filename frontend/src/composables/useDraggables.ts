import { ref } from 'vue'
import type { Ref } from 'vue'
import { useSessionStore } from '@/stores/useSessionStore.js'

export function useMouseDelta() {
	const sessionStore = useSessionStore()
	// this also updates stopCanvasInput because thats all I'm usin it for
	let startX = 0
	let startY = 0
	const deltaX = ref(0)
	const deltaY = ref(0)
	const moving = ref(false)

	function start(event: PointerEvent) {
		moving.value = true
		sessionStore.inputMode = 'widget'

		startX = event.clientX
		startY = event.clientY
		deltaX.value = 0
		deltaY.value = 0
	}
	function move(event: PointerEvent) {
		// returns true if succesful and false if not dragging/clicking :)
		if (!moving.value || event.buttons !== 1) return false

		deltaX.value = event.clientX - startX
		deltaY.value = event.clientY - startY

		return true
	}
	function end() {
		moving.value = false
		sessionStore.inputMode = 'idle'
	}

	return { deltaX, deltaY, start, move, end, moving }
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
