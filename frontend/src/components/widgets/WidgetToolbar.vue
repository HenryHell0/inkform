<script setup lang="ts">
import { useWidgetStore } from '@/stores/useWidgetStore'
import { type Widget } from '@/utils/widgetData'
const widgetStore = useWidgetStore()

const { isDragging, widget } = defineProps<{
	isDragging: boolean
	widget: Widget
}>()
</script>
<template>
	<div
		class="toolbar"
		v-touch-prevent
		@pointerdown="(e) => $emit('toolbarClicked', e)"
		:style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
	>
		<div class="title">{{ widget.type }}</div>

		<div @pointerdown.stop class="button-container" v-if="widget.toolbarButtons">
			<img
				class="toolbar-button"
				v-for="(button, i) in widget.toolbarButtons"
				:key="i"
				:src="`./assets/${button.icon}.svg`"
				@pointerup="button.onClick"
				draggable="false"
			/>
		</div>

		<div @pointerdown.stop class="x-button-container">
			<img src="/assets/x.svg" @pointerup="widgetStore.deleteWidget(widget.id)" class="x-button" draggable="false" />
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

.title {
	color: var(--color-text-dark);
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

.button-container {
	--margin-top-bottom: 1px;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);


	background-color: var(--color-gray-50);
	border-radius: 5px;
	margin-top: var(--margin-top-bottom);
	margin-bottom: var(--margin-top-bottom);


	box-sizing: border-box;
	height: calc( 100% - 2 * var(--margin-top-bottom));
	padding-top: 1px;
	padding-bottom: 1px;

	display: flex;
	padding: 1px;
}

.toolbar-button {

	height: 100%;
	min-height: 10px;
	aspect-ratio: 1 / 1;

	border-radius: inherit;

	cursor: pointer;

	transition:
		background ease-in-out 0.2s,
		transform ease-in-out 0.2s;
}

.toolbar-button:hover {
	background-color: var(--color-bg-1);
	transform: scale(1.1);
}
</style>
