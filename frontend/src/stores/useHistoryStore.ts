import { defineStore } from 'pinia'
import type { Action } from '@/utils/actions'
import { computed, ref } from 'vue'

export const useHistoryStore = defineStore('history', () => {
	const done = ref<Action[]>([])
	const undone = ref<Action[]>([])

	const undoAvailable = computed(() => done.value.length > 0)
	const redoAvailable = computed(() => undone.value.length > 0)

	function execute(action: Action) {
		action.do()
		done.value.push(action)
		undone.value = [] // clear future timeline
	}

	function push(action: Action) {
		done.value.push(action)
		undone.value = [] // clear future timeline
	}

	function undo() {
		const action = done.value.pop()
		if (!action) return
		action.undo()
		undone.value.push(action)
	}

	function redo() {
		const action = undone.value.pop()
		if (!action) return
		action.do()
		done.value.push(action)
	}

	return { execute, push, undo, redo, undoAvailable, redoAvailable }
})
