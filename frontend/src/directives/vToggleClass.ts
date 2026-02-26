import { watchEffect, unref, type Directive } from 'vue'

export const vToggleClass: Directive<HTMLElement, any> = {
	mounted(el, binding) {
		const className = binding.arg

		if (!className) {
			console.warn('v-toogle-class requires a class name argument.')
			return
		}

		const stop = watchEffect(() => {
			const value = typeof binding.value === 'function' ? binding.value() : unref(binding.value)

			el.classList.toggle(className, Boolean(value))
		})

		;(el as any)._vClassIfStop = stop
	},

	unmounted(el) {
		;(el as any)._vClassIfStop?.()
	},
}
