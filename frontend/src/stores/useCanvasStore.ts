import { defineStore } from 'pinia'
import { useSessionStore } from './useSessionStore'
import type { Path } from '@/types/types'
import { ref } from 'vue'

export const useCanvasStore = defineStore('canvas', () => {
	const paths = ref<Path[]>([])

	return { paths }
})
