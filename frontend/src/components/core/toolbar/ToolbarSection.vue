<script setup lang="ts">
import { useSessionStore } from '@/stores/useSessionStore'

const sessionStore = useSessionStore()

function setIdleInputMode() {
	sessionStore.inputMode = 'idle'
}
</script>
<template>
	<div v-drawing-opacity class="toolbar-section" @mouseenter="setIdleInputMode">
		<slot></slot>
	</div>
</template>
<style scoped lang="css">
.toolbar-section {
	padding: 10px 10px;

	display: flex;
	justify-content: center;
	gap: 10px;

	background-color: var(--color-bg-0);
	border-radius: 1000px;
	box-shadow: 0 4px 10px var(--color-box-shadow);
	z-index: 100;
	user-select: none;
}
</style>
