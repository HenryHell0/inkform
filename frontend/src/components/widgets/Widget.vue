<script setup lang="ts">
import { computed } from 'vue'
import { useWidgetDrag, useWidgetResize } from '@/composables/useDraggables'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { useSessionStore } from '@/stores/useSessionStore'
import WidgetToolbar from './WidgetToolbar.vue'
import { useWidgetStyles } from '@/composables/useWidgetStyles'
const widgetStore = useWidgetStore()
const sessionStore = useSessionStore()
const props = defineProps<{
	id: string
}>()
const widget = widgetStore.getWidgetById(props.id)

const { start: dragStart, isDragging } = useWidgetDrag(props.id)
const { start: resizeStart, isResizing } = useWidgetResize(props.id)

const styles = useWidgetStyles(widget)
const classes = computed(() => {
	return {
		dragging: isDragging.value,
		resizing: isResizing.value,
	}
})

function toolbarClicked(event: PointerEvent) {
	dragStart(event)
	sessionStore.heldWidgetId = widget.id
	bringToFront()
}

// todo this should NOT be in-component. it should be a history action
function bringToFront() {
	widgetStore.bringWidgetToFront(widget)
}

</script>
<template>
	<div v-drawing-opacity ref="element" class="template" :class="classes" :style="styles">
		<WidgetToolbar @pointerdown="toolbarClicked" :widget :isDragging></WidgetToolbar>

		<div @click="bringToFront" style="height: 100%">
			<slot></slot>
		</div>
		<img class="resizer" v-touch-prevent  @pointerdown="resizeStart" :src="'./assets/resize.svg'" draggable="false" />
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
	background: var(--color-bg-0);
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
	width: 1.2em;
	height: 1.2em;
	cursor: se-resize;
	fill: var(--color-icon);
	z-index: 2;
}
</style>
