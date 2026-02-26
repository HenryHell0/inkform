import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ToolName } from '@/utils/drawingTools.js'
import type { Position } from '@/types/types'
import { strokeToPath } from '@/utils/svgCanvasUtils'


type InputModeName = 'idle' | 'drawing' | 'widget' | 'feedback' // eventually this will be "dialog" not feedback ...

export const useSessionStore = defineStore('session', () => {
	const currentStroke = ref<Position[]>([])
	const currentPath = computed<string>(() => strokeToPath(currentStroke.value))


	const previousMousePos = ref<Position>({ x: -1, y: -1 })

	const activeTool = ref<ToolName>('pen')
	const inputMode = ref<InputModeName>('idle')

	const heldWidgetId = ref<string>('')

	function updatePreviousMousePos(event: PointerEvent) {
		previousMousePos.value.x = event.clientX
		previousMousePos.value.y = event.clientY
	}

	return {
		currentStroke,
		currentPath,
		previousMousePos,
		activeTool,
		inputMode,
		heldWidgetId,
		// undos,
		// redos,
		updatePreviousMousePos,
	}
})
