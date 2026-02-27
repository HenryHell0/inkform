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
					<UndoIcon></UndoIcon>
				</ToolbarButton>
				<ToolbarButton @click="historyStore.redo()" :disabled="!historyStore.redoAvailable">
					<RedoIcon></RedoIcon>
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
				<img src="/assets/feedback.svg" />
			</ToolbarButton>
		</ToolbarSection>
		<!-- GITHUB -->
		<ToolbarSection>
			<ToolbarButton>
				<a href="https://github.com/henryhell0/hmer-whiteboard" target="_blank">
					<img src="/assets/github.svg" style="transform: scale(1.5)"/>
				</a>
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
	gap: 6px;
}

.center-toolbar {
	margin: 0 auto;
	display: flex;
	gap: 0.4em;
}

.undo-redo-container {
	gap: 5px;
}

a {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
