import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ToolName } from '@/utils/drawingTools.js'
import type { Path } from './useCanvasStore'

interface Position {
	x: number
	y: number
}

type InputModeName = 'idle' | 'drawing' | 'widget' | 'feedback' // eventually this will be "dialog" not feedback ...

export const useSessionStore = defineStore('session', () => {
	const currentStroke = ref<Position[]>([])
	const currentPath = computed<string>(() => {
		if (currentStroke.value.length === 0) return ''
		return (
			`M ${currentStroke.value[0]!.x},${currentStroke.value[0]!.y} ` +
			currentStroke.value
				.slice(1)
				.map((p) => `L ${p.x},${p.y}`)
				.join(' ')
		)
	})

	const previousMousePos = { x: -1, y: -1 }

	const activeTool = ref<ToolName>('pen')
	const inputMode = ref<InputModeName>('idle')

	const heldWidgetId = ref<string>('')
	const undos = ref<Path[]>([])



	return { currentStroke, currentPath, previousMousePos, activeTool, inputMode, heldWidgetId, undos }
})
