<script setup lang="ts">
import { useSessionStore } from '@/stores/useSessionStore'
import { useDrawingOpacity } from '@/composables/useDrawingOpacity'
import { ref } from 'vue'

const sessionStore = useSessionStore()

// add drawing opacity composable
const element = ref<HTMLElement | null>(null)
useDrawingOpacity(element)

function setIdleInputMode() {
	sessionStore.inputMode = 'idle'
}
</script>
<template>
	<div ref="element" class="toolbar-section" @mouseenter="setIdleInputMode">
		<slot></slot>
	</div>
</template>
<style scoped lang="css">
.toolbar-section {
	padding: 10px 10px;

	display: flex;
	justify-content: center;
	gap: 10px;

	background-color: var(--toolbar-background);
	border-radius: 1000px;
	box-shadow: 0 4px 10px var(--color-box-shadow);
	z-index: 100;
	user-select: none;
}
</style>
