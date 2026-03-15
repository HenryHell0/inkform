<script setup lang="ts">
import { inject, type Ref } from 'vue';

defineProps<{
	close: () => void
}>()

const isDragging = inject<Ref<boolean>>("isDragging")

</script>
<template>
	<div class="toolbar" v-touch-prevent :style="{ cursor: isDragging ? 'grabbing' : 'grab' }">
		<!-- TITLE -->
		<div class="title">
			<slot name="title" class="title" />
		</div>

		<!-- BUTTONS/CONTENT -->
		<div class="content">
			<slot name="content"></slot>
		</div>

		<!-- X BUTTON -->
		<img @pointerdown.stop src="/assets/x.svg" @pointerup="close" class="x-button" draggable="false" />
	</div>
</template>
<style scoped>
.toolbar {
	width: 100%;
	position: relative;

	border-top-left-radius: inherit;
	border-top-right-radius: inherit;
	background-color: var(--color-bg-1);

	display: flex;
	justify-content: space-between;
	align-items: center;

	cursor: grab;
}

.title {
	color: var(--color-text-dark);
	font-size: 1em;
	padding: 0.5em;
}

.content {
	display: flex;
	gap: 5px;
	align-items: center;
}

.x-button {
	height: 2.3em;
	box-sizing: border-box;
	padding: 0.1em;
	border-radius: 100px;
	transition: background 0.3s ease, transform 0.1s ease-in-out;
	cursor: pointer;
}

.x-button:hover {
	background-color: var(--color-bg-0);
	transform: scale(1.1);
}
</style>
