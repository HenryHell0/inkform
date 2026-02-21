// directives/vDrawingOpacity.ts
import type { Directive } from 'vue'
import { useSessionStore } from '@/stores/useSessionStore.js'

interface DrawingOpacityOptions {
	drawOpacity?: number
	drawPointerEvents?: string
	normalOpacity?: number
	normalPointerEvents?: string
}

interface DrawingOpacityElement extends HTMLElement {
  __vDrawingOpacityCleanup__?: () => void
}

export const vDrawingOpacity: Directive<HTMLElement, DrawingOpacityOptions> = {
	mounted(el, binding) {
		const element = el as DrawingOpacityElement
		const sessionStore = useSessionStore()
		// get options and set default value
		const options = binding.value || {}
		const {
			drawOpacity = 0.8,
			drawPointerEvents = 'none',
			normalOpacity = 1,
			normalPointerEvents = 'auto',
		} = options

		const changeDrawingOpacity = (event: PointerEvent) => {
			const bbox = element.getBoundingClientRect()
			const inside =
				event.clientX > bbox.left &&
				event.clientX < bbox.right &&
				event.clientY > bbox.top &&
				event.clientY < bbox.bottom

			element.style.opacity = inside ? drawOpacity.toString() : normalOpacity.toString()
		}

		const stop = () => {
			document.removeEventListener('pointermove', changeDrawingOpacity)
			element.style.pointerEvents = normalPointerEvents
			element.style.opacity = normalOpacity.toString()
		}

		const start = () => {
			document.addEventListener('pointermove', changeDrawingOpacity)
			element.style.pointerEvents = drawPointerEvents
		}

		const unwatch = sessionStore.$subscribe((mutation, state) => {
			if (state.inputMode === 'drawing') start()
			else stop()
		})

		element.__vDrawingOpacityCleanup__ = () => {
			stop()
			unwatch()
		}
	},

	unmounted(el) {
		const element = el as DrawingOpacityElement
		element.__vDrawingOpacityCleanup__?.()
		delete element.__vDrawingOpacityCleanup__
	},
}
