<script setup lang="ts">
import { useWidgetStore } from '@/stores/useWidgetStore'
import { type Widget } from '@/utils/widgetData'
const widgetStore = useWidgetStore()

const { isDragging } = defineProps<{
	isDragging: boolean
	close: () => void
}>()
</script>
<template>
	<div class="toolbar" v-touch-prevent :style="{ cursor: isDragging ? 'grabbing' : 'grab' }">

		<slot name="title" class="title" />
		<slot></slot>

		<div @pointerdown.stop class="x-button-container">
			<img src="/assets/x.svg" @pointerup="close" class="x-button" draggable="false" />
		</div>
	</div>
</template>
<style scoped>
.toolbar {
	border-top-left-radius: inherit;
	border-top-right-radius: inherit;
	background-color: var(--color-bg-1);
	width: 100%;
	position: relative;

	display: flex;
	flex-direction: row;
	justify-content: space-between;

	cursor: grab;
}

/* ? will this apply to slotted title text? */
::slotted(.title) {
	/* color: var(--color-text-dark); */
	color: red;
	font-size: 100%;
	padding: 0.5em;
	align-self: flex-start;
}

.x-button-container {
	display: flex;
	align-items: center;
	justify-content: center;
}

.x-button {
	height: 100%;
	box-sizing: border-box;
	padding: 0.1em;
	border-radius: 100px;
	transition: background 0.3s ease;
	cursor: pointer;
}

.x-button:hover {
	background-color: var(--color-bg-3);
}
</style>
