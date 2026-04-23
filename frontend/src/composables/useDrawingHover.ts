import { useSessionStore } from '@/stores/useSessionStore'
import { computed, onUnmounted, ref, watch, type Ref } from 'vue'

export function useDrawingHover(target: Ref<HTMLElement | null>) {
	const sessionStore = useSessionStore()

	const isDrawing = computed(() => sessionStore.inputMode === 'drawing')
	const isInside = computed(() => {
		if (!isDrawing.value) return false

		const el = target.value
		if (!el) return false

		const rect = el.getBoundingClientRect()

		return x.value > rect.left && x.value < rect.right && y.value > rect.top && y.value < rect.bottom
	})
	const isActive = computed(() => isDrawing.value && isInside.value)

	const x = ref(0)
	const y = ref(0)

	const update = (event: PointerEvent) => {
		x.value = event.clientX
		y.value = event.clientY
	}

	// Only track pointer when drawing
	watch(
		isDrawing,
		(on) => {
			if (on) window.addEventListener('pointermove', update)
			else window.removeEventListener('pointermove', update)
		},
		{ immediate: true },
	)

	onUnmounted(() => {
		window.removeEventListener('pointermove', update)
	})

	return {
		isActive,
	}
}
