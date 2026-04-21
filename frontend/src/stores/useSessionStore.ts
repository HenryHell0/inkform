import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import type { ToolName } from '@/utils/drawingTools.js'
import type { Position } from '@/types/types'
import { strokeToPath } from '@/utils/svgCanvasUtils'
import type { Widget } from '@/utils/widgetData'


type InputModeName = 'idle' | 'drawing' | 'widget'

export const useSessionStore = defineStore('session', () => {
	const currentStroke = ref<Position[]>([])
	const currentPath = computed<string>(() => strokeToPath(currentStroke.value))


	const previousMousePos = ref<Position>({ x: -1, y: -1 })

	const activeTool = ref<ToolName>('pen')
	const inputMode = ref<InputModeName>('idle')

	const heldWidget = shallowRef<null | Widget>(null)
	const hoveredWidgetsDuringDrag: Widget[] = []

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
		heldWidget,
		updatePreviousMousePos,
		hoveredWidgetsDuringDrag
	}
})
