<script setup lang="ts">
import { useSessionStore } from '@/stores/useSessionStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { useRouteDialogs } from '@/composables/useRouteDialogs'
import { toolList } from '@/utils/drawingTools'
import ToolbarSection from './ToolbarSection.vue'
import ToolbarButton from './ToolbarButton.vue'
import RedoIcon from '@/components/icons/RedoIcon.vue'
import UndoIcon from '@/components/icons/UndoIcon.vue'
const sessionStore = useSessionStore()
const historyStore = useHistoryStore()
const { open: openRouteDialog } = useRouteDialogs()
</script>
<template>
	<div ref="element" class="toolbar-container">
		<ToolbarSection>
			<ToolbarButton @click="openRouteDialog('info')">
				<img src="/assets/info.svg" style="transform: scale(1.45)" draggable="false" />
			</ToolbarButton>
		</ToolbarSection>

		<div class="toolbar-group">
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
					<img :src="`./assets/${tool}.svg`" draggable="false" />
				</ToolbarButton>
			</ToolbarSection>
		</div>

		<!-- FEEDBACK -->
		<div class="toolbar-group">
			<ToolbarSection>
				<ToolbarButton @click="openRouteDialog('feedback')">
					<img src="/assets/feedback.svg" draggable="false" />
				</ToolbarButton>
			</ToolbarSection>
			<!-- GITHUB -->
			<ToolbarSection>
				<ToolbarButton>
					<a href="https://github.com/henryhell0/inkform" target="_blank">
						<img src="/assets/github.svg" style="transform: scale(1.5)" draggable="false" />
					</a>
				</ToolbarButton>
			</ToolbarSection>
		</div>
	</div>
</template>
<style scoped>
.toolbar-container {
	width: 100%;

	display: flex;
	justify-content: space-between;
	gap: 6px;
}

.toolbar-group {
	display: flex;
	gap: 6px;
}

.undo-redo-container {
	gap: 5px;
}

a {
	display: flex;
	align-items: center;
	justify-content: center;
}

img {
	pointer-events: none;
}
</style>
