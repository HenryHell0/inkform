<script setup lang="ts">
import { useSessionStore } from '@/stores/useSessionStore'
import { useCanvasStore } from '@/stores/useCanvasStore'
import { toolList } from '@/utils/drawingTools'
import ToolbarSection from './ToolbarSection.vue'
import ToolbarButton from './ToolbarButton.vue'
const sessionStore = useSessionStore()
const canvasStore = useCanvasStore()

</script>
<template>
	<div ref="element" class="toolbar-container">
		<!-- future left one -->
		<!-- <ToolbarSection style="display: hidden"> </ToolbarSection> -->

		<!-- ========== DRAWING TOOLS ============= -->
		<!-- later we will have this be its own little thing and add undo/redo and pan tools -->

		<div class="center-toolbar">
			<ToolbarSection class="undo-redo">
				<ToolbarButton @click="canvasStore.undo()">
					<img src="/assets/undo.svg" />
				</ToolbarButton>
				<ToolbarButton @click="canvasStore.redo()">
					<img src="/assets/redo.svg" />
				</ToolbarButton>
			</ToolbarSection>
			<ToolbarSection>
				<ToolbarButton
					v-for="tool in toolList"
					:key="tool"
					:active="sessionStore.activeTool === tool"
					@click="sessionStore.activeTool = tool"
				>
					<img :src="`./assets/${tool}.svg`" />
				</ToolbarButton>
			</ToolbarSection>
		</div>

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
	align-items: center;
	justify-content: space-between;
}

.center-toolbar {
	margin: 0 auto;
	display: flex;
	gap: 0.4em;
}

.undo-redo {
	gap: 5px;
}
</style>
