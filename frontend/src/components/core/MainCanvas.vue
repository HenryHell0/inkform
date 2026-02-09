<script setup lang="ts">
/*
NAMING CONVENTIONS:
path - d prop for <path> element - a string with path data
stroke - user input (position stuff)
*/
import { useCanvasStore } from '@/stores/useCanvasStore'
import { useSessionStore } from '@/stores/useSessionStore'
import { tools } from '@/utils/drawingTools'
import { DEBUG } from '@/utils/debug'

const sessionStore = useSessionStore()
const canvasStore = useCanvasStore()

function SVGMouseDown(event: MouseEvent | PointerEvent) {
	if (sessionStore.inputMode != 'idle') return
	sessionStore.inputMode = 'drawing'

	tools[sessionStore.activeTool].onDown?.(event)
}

function SVGMouseMove(event: MouseEvent | PointerEvent) {
	if (sessionStore.inputMode == 'drawing') {
		tools[sessionStore.activeTool].onMove?.(event)
	}
	sessionStore.previousMousePos.x = event.clientX
	sessionStore.previousMousePos.y = event.clientY

	if (DEBUG.logMouseMovements) {
		console.log(
			`ClientX: ${event.clientX}  ClientY: ${event.clientY}. \n OffsetX: ${event.offsetX}  OffsetY: ${event.offsetY}`,
		)
	}
}

function SVGMouseUp() {
	if (sessionStore.inputMode != 'drawing') return
	sessionStore.inputMode = 'idle'

	tools[sessionStore.activeTool].onUp?.()
}
</script>
<template>
	<svg id="inputSVG" class="inputSVG" @mousedown="SVGMouseDown" @mouseup="SVGMouseUp" @mousemove="SVGMouseMove">
		<path v-for="path in canvasStore.paths" :d="path.d" class="stroke" :key="path.id" :data-id="path.id" />

		<path v-if="sessionStore.currentStroke.length > 1" :d="sessionStore.currentPath" class="stroke" />
	</svg>
</template>
<style scoped>
.inputSVG {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	border: none;
	cursor: crosshair;

	background: --color-bg;
}

.stroke {
	stroke-linejoin: round;
	stroke-linecap: round;
	fill: none;
	stroke: black;
	stroke-width: 2;
	pointer-events: stroke;
}
</style>
