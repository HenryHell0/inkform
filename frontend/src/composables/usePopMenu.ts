import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

export function usePopMenu(closeMenuOnClick = false) {
	const isOpen = ref(false)
	const activatorElement = ref<HTMLElement | null>(null)
	const menuElement = ref<HTMLElement | null>(null)

	const position = ref({ top: 0, left: 0 })

	function toggle() {
		isOpen.value = !isOpen.value
		if (isOpen.value) positionMenu()
	}

	function close() {
		isOpen.value = false
	}

	function menuClicked() {
		if (closeMenuOnClick) close()
	}

	function onClickOutside(event: MouseEvent) {
		const target = event.target
		if (!(target instanceof Node)) return

		if (!activatorElement.value?.contains(target) && !menuElement.value?.contains(target)) {
			close()
		}
	}
	// PS I could just use uhh anchor positioning
	function positionMenu() {
		nextTick(() => {
			if (!activatorElement.value || !menuElement.value) return

			// make rectanges
			const activatorRect = activatorElement.value.getBoundingClientRect()
			const menuRect = menuElement.value.getBoundingClientRect()

			// set inital position
			const distance = 4
			let top = activatorRect.bottom + distance
			let left = activatorRect.left

			// prevent going off right edge
			if (left + menuRect.width > window.innerWidth) {
				left = window.innerWidth - menuRect.width - distance * 2
			}

			// prevent going off bottom
			if (top + menuRect.height > window.innerHeight) {
				top = activatorRect.top - menuRect.height - distance
			}

			// prevent going off left
			if (left < 0) left = distance

			// prevent going off top
			if (top < 0) top = distance

			// set position
			position.value = { top, left }
		})
	}

	onMounted(() => {
		document.addEventListener('mousedown', onClickOutside)
	})

	onBeforeUnmount(() => {
		document.removeEventListener('mousedown', onClickOutside)
	})

	return {
		isOpen,
		position,
		activatorElement,
		menuElement,
		toggle,
		menuClicked,
	}
}
