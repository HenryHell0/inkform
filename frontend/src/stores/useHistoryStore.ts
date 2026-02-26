import { defineStore } from 'pinia'
import type { Action } from '@/utils/actions'
import { ref } from 'vue'

export const useHistoryStore = defineStore('history', () => {
	const done = ref<Action[]>([])
	const undone = ref<Action[]>([])

	function execute(action: Action) {
		action.do()
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

	return { execute, undo, redo }
})
