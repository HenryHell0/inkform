import { watch, onUnmounted, type Ref } from 'vue'
import { useSessionStore } from '@/stores/useSessionStore.js'

interface DrawingOpacityOptions {
	drawOpacity?: number
	drawPointerEvents?: string
	normalOpacity?: number
	normalPointerEvents?: string
}

export function useDrawingOpacity(element: Ref<HTMLElement | null>, options: DrawingOpacityOptions = {}) {
	const sessionStore = useSessionStore()

	const { drawOpacity = 0.8, drawPointerEvents = 'none', normalOpacity = 1, normalPointerEvents = 'auto' } = options

	function changeDrawingOpacity(event: PointerEvent) {
		if (!element.value) throw new Error("element doesen't exist :(")
		if (sessionStore.inputMode !== 'drawing') return

		const bbox = element.value.getBoundingClientRect()
		const inside =
			event.clientX > bbox.left &&
			event.clientX < bbox.right &&
			event.clientY > bbox.top &&
			event.clientY < bbox.bottom

		element.value.style.opacity = inside ? drawOpacity.toString() : normalOpacity.toString()
	}

	watch(
		() => sessionStore.inputMode,
		(mode) => {
			if (!element.value) return
			if (mode === 'drawing') {
				document.addEventListener('pointermove', changeDrawingOpacity)
				element.value.style.pointerEvents = drawPointerEvents
			} else {
				document.removeEventListener('pointermove', changeDrawingOpacity)
				element.value.style.pointerEvents = normalPointerEvents
				element.value.style.opacity = normalOpacity.toString()
			}
		},
		{ immediate: true },
	)

	onUnmounted(() => {
		document.removeEventListener('pointermove', changeDrawingOpacity)
	})
}
