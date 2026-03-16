import { defineStore } from 'pinia'
import { useSessionStore } from './useSessionStore'
import type { Path } from '@/types/types'
import { ref } from 'vue'

export const useCanvasStore = defineStore('canvas', () => {
	const paths = ref<Path[]>([])

	function removePathById(id: string) {
		paths.value = paths.value.filter((p) => p.id != id)
	}

	return { paths, removePathById }
})
