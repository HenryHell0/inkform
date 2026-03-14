<script setup lang="ts">
defineProps<{
	active?: boolean
	disabled?: boolean
}>()
</script>
<!-- note: if we ever want a toolbar indicator or a toolbar button that changes icon based on something, we can use a slot instead, or make <ToolbarIndicator> -->
<template>
	<button class="toolbar-button" :class="{ active }" :disabled="disabled">
		<slot />
	</button>
</template>
<style scoped lang="css">
:slotted(img),
:slotted(svg) {
	fill: var(--color-icon);
	-webkit-user-drag: none;
	user-select: none;

	width: 1.5em;
	height: 1.5em;
	aspect-ratio: 1/1;
	/* transform: scale(1.3); */
}

.toolbar-button {
	height: 10px;
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
