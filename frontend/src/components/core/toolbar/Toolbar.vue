<script setup lang="ts">
import { useSessionStore } from '@/stores/useSessionStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { toolList } from '@/utils/drawingTools'
import ToolbarSection from './ToolbarSection.vue'
import ToolbarButton from './ToolbarButton.vue'
import RedoIcon from '@/components/images/RedoIcon.vue'
import UndoIcon from '@/components/images/UndoIcon.vue'

const sessionStore = useSessionStore()
const historyStore = useHistoryStore()
</script>
<template>
	<div ref="element" class="toolbar-container">
		<!-- future left one -->
		<!-- <ToolbarSection style="display: hidden"> </ToolbarSection> -->

		<div class="center-toolbar">
			<!-- UNDO/REDO -->
			<ToolbarSection class="undo-redo-container">
				<ToolbarButton @click="historyStore.undo()" :disabled="!historyStore.undoAvailable">
					<UndoIcon v-toggle-class:icon-unavailable="() => !historyStore.undoAvailable"></UndoIcon>
				</ToolbarButton>
				<ToolbarButton @click="historyStore.redo()" :disabled="!historyStore.redoAvailable">
					<RedoIcon v-toggle-class:icon-unavailable="() => !historyStore.redoAvailable"></RedoIcon>
				</ToolbarButton>
			</ToolbarSection>
			<!-- TOOLS -->
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

		<!-- FEEDBACK -->
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

.undo-redo-container {
	gap: 5px;
}

.icon-unavailable {
	fill: var(--color-icon-unavailable);
}
</style>
