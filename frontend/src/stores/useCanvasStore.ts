import { defineStore } from 'pinia'
import { useSessionStore } from './useSessionStore'
import { ref } from 'vue'

export interface Path {
	d: string
	id: string
}

export const useCanvasStore = defineStore('canvas', () => {
	const paths = ref<Path[]>([])

	function undo() {
		const sessionStore = useSessionStore()
		if (paths.value.length == 0) return
		sessionStore.undos.push(paths.value.pop()!)
	}
	function redo() {
		const sessionStore = useSessionStore()
		if (sessionStore.undos.length == 0) return
		paths.value.push(sessionStore.undos.pop()!)
	}

	return { paths, undo, redo }
})
