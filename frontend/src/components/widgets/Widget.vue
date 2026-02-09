<script setup lang="ts">
import { ref, toRef, computed, onMounted, onUnmounted, watch } from 'vue'

import { useDrag, useResize } from '@/composables/useDraggables'
import { useDrawingOpacity } from '@/composables/useDrawingOpacity'

import { useWidgetStore } from '@/stores/useWidgetStore'
import { useSessionStore } from '@/stores/useSessionStore'
import WidgetToolbar from './WidgetToolbar.vue'

const widgetStore = useWidgetStore()
const sessionStore = useSessionStore()

const props = defineProps<{
	id: string
}>()
const widget = widgetStore.getWidgetById(props.id)

var element = ref<HTMLElement | null>(null)
useDrawingOpacity(element)

const { dragStart, dragMove, dragEnd, isDragging } = useDrag(toRef(widget, 'x'), toRef(widget, 'y'))
const { resizeStart, resizeMove, resizeEnd, isResizing } = useResize(toRef(widget, 'width'), toRef(widget, 'height'))

const classes = computed(() => {
	return {
		dragging: isDragging.value,
		resizing: isResizing.value,
	}
})
const styles = computed(() => {
	return {
		left: widget.x.toString() + 'px',
		top: widget.y.toString() + 'px',
		width: widget.width.toString() + 'px',
		height: widget.height.toString() + 'px',
		zIndex: widget.zIndex.toString(),
	}
})

// clamp widget movement
function clampToViewport() {
	const windowWidth = window.innerWidth
	const windowHeight = window.innerHeight

	// X bounds
	if (widget.x < 0) widget.x = 0
	if (widget.x + widget.width > windowWidth) widget.x = windowWidth - widget.width

	// Y bounds
	if (widget.y < 0) widget.y = 0
	if (widget.y + widget.height > windowHeight) widget.y = windowHeight - widget.height
}
// Watch movement and clamp
watch(
	() => [widget.x, widget.y],
	() => clampToViewport(),
	{ deep: false },
)
watch(
	() => [widget.width, widget.height],
	() => clampToViewport(),
)

function toolbarClicked(event: MouseEvent) {
	dragStart(event)
	sessionStore.heldWidgetId = widget.id
	bringToFront()
}
function toolBarMove(event: MouseEvent) {
	if (!dragMove(event)) return

	if (!element.value) throw new Error('no element aaah!')
	element.value.style.pointerEvents = 'none'
}
function toolbarReleased() {
	dragEnd()

	// check if user is over the toolbar
	if (!element.value) return
	element.value.style.pointerEvents = 'fill'

	// reset widget ID and reset mode
	sessionStore.heldWidgetId = ''
}

function bringToFront() {
	widgetStore.bringWidgetToFront(widget)
}

onMounted(() => {
	clampToViewport()

	document.addEventListener('mousemove', toolBarMove)
	document.addEventListener('mouseup', toolbarReleased)

	document.addEventListener('mousemove', resizeMove)
	document.addEventListener('mouseup', resizeEnd)
})
onUnmounted(() => {
	document.removeEventListener('mousemove', dragMove)
	document.removeEventListener('mouseup', dragEnd)

	document.removeEventListener('mousemove', resizeMove)
	document.removeEventListener('mouseup', resizeEnd)
})
</script>
<template>
	<div ref="element" class="template" :class="classes" :style="styles">
		<WidgetToolbar @toolbarClicked="toolbarClicked" :widget :isDragging></WidgetToolbar>

		<div @click="bringToFront" style="height: 100%">
			<slot></slot>
		</div>

		<img class="resizer" @mousedown="resizeStart" :src="'./assets/resize.svg'" draggable="false" />
	</div>
</template>
<style scoped>
.template {
	/*? change this to work with future graphs. this should be in expression prolly */
	user-select: none;
	z-index: 2;
	position: absolute;

	display: flex;
	flex-direction: column;
	overflow: hidden;

	border-radius: 0.5em;
	background: var(--color-widget-background);
	box-shadow: 2px 2px 10px var(--color-box-shadow);

	pointer-events: fill;
}

.dragging {
	box-shadow: 10px 10px 15px var(--color-box-shadow);
	opacity: 80%;
}

.resizing {
	opacity: 80%;
}

.resizer {
	position: absolute;
	right: 0;
	bottom: 0;
	transform: translate(-1px, -1px);
	width: 1em;
	height: 1em;
	cursor: se-resize;
	fill: var(--color-icon);
	z-index: 2;
}
</style>
