import type { Directive } from 'vue'

// this bassically just prevents mobile scrolling on elements
export const vTouchPrevent: Directive = {
	mounted(element) {
		const prevent = (e: TouchEvent) => e.preventDefault()

		element.__touchPreventHandler__ = prevent // store handler so we can remove it later

		element.addEventListener('touchstart', prevent, { passive: false })
		element.addEventListener('touchmove', prevent, { passive: false })
		element.addEventListener('touchend', prevent, { passive: false })
		element.addEventListener('touchcancel', prevent, { passive: false })
	},
	unmounted(element) {
		const prevent = element.__touchPreventHandler__
		if (!prevent) return

		element.removeEventListener('touchstart', prevent)
		element.removeEventListener('touchmove', prevent)
		element.removeEventListener('touchend', prevent)
		element.removeEventListener('touchcancel', prevent)
		delete element.__touchPreventHandler__
	},
}
