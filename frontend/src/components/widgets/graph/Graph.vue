<script setup lang="ts">
import { useWidgetStore } from '@/stores/useWidgetStore'
import { useSessionStore } from '@/stores/useSessionStore'
import GraphBottomBar from './GraphBottomBar.vue'
import GraphContent from './GraphContent.vue'
import { ExpressionData, GraphData } from '@/utils/widgetData'
import Widget from '../Widget.vue'
import { provide } from 'vue'
import WidgetToolbar from '../toolbar/WidgetToolbar.vue'

const widgetStore = useWidgetStore()
const sessionStore = useSessionStore()

const props = defineProps<{
	id: string
}>()
const widget = widgetStore.getWidgetById(props.id)
provide('widget', widget) // hmm this is repeat code and doesen't cause an error when not used, so I think I should do v-bind:widget=widget to Wiget.vue instead...

// might wanna extract to useImportExpression or something
async function importExpression() {
	if (!sessionStore.heldWidgetId) return
	if (!(widget instanceof GraphData)) throw new Error('this widget is not a graph!!! aah!')
	const heldWidget = widgetStore.getWidgetById(sessionStore.heldWidgetId)
	if (!(heldWidget instanceof ExpressionData)) return
	// add it

	widget.addExpression(heldWidget)
	widgetStore.deleteWidget(heldWidget.id)
}
</script>
<template>
	<Widget data-drop-type="graph" @widget-drop="importExpression">
		<template #toolbar>
			<WidgetToolbar @close="widgetStore.deleteWidget(id)">
				<template #title> Graph </template>
			</WidgetToolbar>
		</template>
		<template #content>
			<div class="content">
				<GraphContent :id="props.id"></GraphContent>
				<GraphBottomBar :id="props.id"></GraphBottomBar>
			</div>
		</template>
	</Widget>
</template>
<style scoped>
.content {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: flex-start;

	width: 100%;
	height: 100%;
}
</style>
