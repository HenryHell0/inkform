<script setup lang="ts">
import { useSessionStore } from '@/stores/useSessionStore'
import { toolList } from '@/utils/drawingTools'
import ToolbarSection from './ToolbarSection.vue'
import ToolbarButton from './ToolbarButton.vue'
const sessionStore = useSessionStore()
</script>
<template>
	<div ref="element" class="toolbar-container">
		<!-- future left one -->
		<!-- <ToolbarSection style="display: hidden"> </ToolbarSection> -->

		<!-- ========== DRAWING TOOLS ============= -->
		<!-- later we will have this be its own little thing and add undo/redo and pan tools -->

		<ToolbarSection class="center-toolbar">
			<ToolbarButton
				v-for="tool in toolList"
				:key="tool"
				:active="sessionStore.activeTool === tool"
				@click="sessionStore.activeTool = tool"
			>
				<img :src="`./assets/${tool}.svg`" />

			</ToolbarButton>
		</ToolbarSection>

		<ToolbarSection>
			<ToolbarButton @click="sessionStore.inputMode = 'feedback'">
				<img :src="'./assets/feedback.svg'" />
			</ToolbarButton>
		</ToolbarSection>
	</div>
</template>
<style scoped>
.toolbar-container {
	width: 100%;
	display: flex;
	flex-direction: row;

	align-items: center;
	justify-content: space-between;
}

.center-toolbar {
	margin: 0 auto;
}
</style>
