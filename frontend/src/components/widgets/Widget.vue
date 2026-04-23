<script setup lang="ts">
import { computed, inject, provide, useTemplateRef, type Ref } from 'vue'
import { useWidgetDrag, useWidgetResize } from '@/composables/useDraggables'
import { useWidgetStyles } from '@/composables/useWidgetStyles'
import { useWidgetStore } from '@/stores/useWidgetStore'
import type { Widget } from '@/utils/widgetData'
import { useDrawingHover } from '@/composables/useDrawingHover'

// ! NOTE: this REQUIRES widget to be provided... so we might want to do a require prop, and then wiget.vue provides it.
// also, we might want to do some sort of useWidgetInject or something... or make another wrapper around widgets that provides.. or provide here... idk.
const widget = inject<Widget>('widget')!
const widgetStore = useWidgetStore()
const element = useTemplateRef('element')

const { start: dragStart, isDragging } = useWidgetDrag(widget)
const { start: resizeStart, isResizing } = useWidgetResize(widget)
const { isActive: isDrawingBelow } = useDrawingHover(element)

const styles = useWidgetStyles(widget)
const classes = computed(() => {
	return {
		dragging: isDragging.value,
		resizing: isResizing.value,
		drawingBelow: isDrawingBelow.value
	}
})

provide('isDragging', isDragging)
</script>
<template>
	<!-- we might want to change this to using bounding boxes and data directly instead of data-widget-id for the pannable viewport -->
	<div ref="element" class="wrapper" :class="classes" :style="styles">
		<!-- TOOLBAR -->
		<div @pointerdown="dragStart">
			<slot name="toolbar" />
		</div>

		<!-- MAIN CONTENT -->
		<div @pointerdown="widgetStore.bringWidgetToFrontIfNeeded(widget)" style="height: 100%">
			<slot name="content"></slot>
		</div>

		<!-- RESIZER -->
		<img
			class="resizer"
			v-touch-prevent
			@pointerdown="resizeStart"
			:src="'./assets/resize.svg'"
			draggable="false"
		/>
	</div>
</template>
<style scoped>
.wrapper {
	user-select: none;
	z-index: 2;
	position: absolute;

	display: flex;
	flex-direction: column;

	border-radius: 0.5em;
	background: var(--color-bg-0);
	box-shadow: 2px 2px 10px var(--color-box-shadow);

	pointer-events: fill;
	overflow: hidden;
}

.dragging {
	box-shadow: 10px 10px 15px var(--color-box-shadow);
	opacity: 0.92;
}

.resizing {
	opacity: 0.92;
}

.drawingBelow {
	opacity: 0.8;
	pointer-events: none;
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

	transition: transform 0.1s var(--bounce-curve);
}

.resizer:active {
	transform: scale(0.8) translate(1px, 1px);
}
</style>
