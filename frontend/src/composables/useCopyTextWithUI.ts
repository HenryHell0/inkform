import { copyText } from '@/utils/utils'
import { ref } from 'vue'

export function useCopyTextWithUI(text: string | Promise<string>, timeOutMs: number = 1300) {
	const copyUIOpen = ref<boolean>(false)
	const copyTimeout = ref<number | null>(null)

	async function copy() {
		copyUIOpen.value = true
		copyTimeout.value = null
		copyText(await text)

		copyTimeout.value = setTimeout(() => {
			copyUIOpen.value = false
		}, timeOutMs)
	}

	return { copy, copyUIOpen }
}
