<script setup lang="ts">
defineProps<{
	active?: boolean
	disabled?: boolean
}>()
</script>
<!-- note: if we ever want a toolbar indicator or a toolbar button that changes icon based on something, we can use a slot instead, or make <ToolbarIndicator> -->
<template>
	<button :class="{ active }" :disabled="disabled">
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
	transform: scale(1.3);
}

button {
	--scale-1: 1.12;
	--scale-2: 1.2;

	all: unset;
	padding: 10px 10px;
	border-radius: 10000px;

	/* center image */
	display: flex;
	align-items: center;
	justify-content: center;

	border: none;
	/* background-color: #eee; */
	cursor: pointer;
	user-select: none;
	transition:
		transform 0.15s ease,
		background 0.3s ease;
}

button:hover {
	transform: scale(var(--scale-2));
	background: var(--color-bg-1);
}


/* styles for disabled buttons */
button:disabled {
	cursor: default;
	pointer-events: none;
	transform: none;
	background: none;
}
button:disabled :slotted(svg) {
	fill: var(--color-icon-unavailable);
}
button:disabled:hover {
	transform: none;
	background: none;
}


/* active button styles */
button.active {
	transform: scale(var(--scale-1));
	background-color: var(--color-bg-3);
}

button.active:hover {
	transform: scale(var(--scale-2));
	background-color: var(--color-bg-2);
}
</style>
