<script setup lang="ts">
defineProps<{
	active?: boolean
	disabled?: boolean
}>()
</script>
<!-- note: if we ever want a toolbar indicator or a toolbar button that changes icon based on something, we can use a slot instead, or make <ToolbarIndicator> -->
<template>
	<button class="toolbar-button" :class="{ active }" :disabled @pointerdown.stop>
		<slot />
	</button>
</template>
<style scoped lang="css">
.toolbar-button {
	box-sizing: border-box;
	padding: 0px; /* controls spacing between button and image (border-box=this controls size of image)*/
	margin: 0px; /* DON'T use this in flexbox layouts. instead use gap and padding on the parent! */

	width: 2em;
	height: 2em;

	border-radius: inherit;
	cursor: pointer;

	transition:
		background ease-in-out 0.15s,
		transform ease-in-out 0.1s;
}

.toolbar-button:hover {
	background-color: var(--color-bg-1);
	transform: scale(1.1);
}

.toolbar-button:active {
	transform: scale(0.92);
}

:slotted(img),
:slotted(svg) {
	fill: var(--color-icon);
	-webkit-user-drag: none;
	user-select: none;

	width: 100%;
	height: 100%;
	aspect-ratio: 1/1;

}
</style>
