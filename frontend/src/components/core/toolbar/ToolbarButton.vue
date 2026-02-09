<script setup lang="ts">
defineProps<{
	active?: boolean
}>()
</script>
<!-- note: if we ever want a toolbar indicator or a toolbar button that changes icon based on something, we can use a slot instead, or make <ToolbarIndicator> -->
<template>
	<button :class="{ active: active }">
		<slot />
	</button>
</template>
<style scoped lang="css">
:slotted(img) {
	-webkit-user-drag: none;
	user-select: none;

	width: 1.5em;
	height: 1.5em;
	fill: var(--color-icon);
	transition: rotate 0.2s ease;
	transform: scale(1.2);
}

button {
	all: unset;
	padding: 8px 10px;
	border-radius: 10000px;
	border: none;
	/* background-color: #eee; */
	cursor: pointer;
	user-select: none;
	transition:
		transform 0.15s ease,
		background 0.3s ease;
}

button:hover {
	transform: scale(1.1);
	background: var(--color-toolbar-button-hover);
}

button.active {
	background-color: var(--color-toolbar-button-active);
	transform: scale(1.1);
}

button.active:hover {
	background-color: var(--color-toolbar-button-active-hover);
	transform: scale(1.2);
}
</style>
