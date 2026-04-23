<script setup lang="ts">
import { useWidgetStore } from '@/stores/useWidgetStore'
import GraphBottomBar from './GraphBottomBar.vue'
import GraphContent from './GraphContent.vue'
import { GraphData } from '@/utils/widgetData'
import Widget from '../Widget.vue'
import { provide } from 'vue'
import WidgetToolbar from '../toolbar/WidgetToolbar.vue'

const widgetStore = useWidgetStore()
const props = defineProps<{
	id: string
}>()
const widget = widgetStore.getWidgetById(props.id) as GraphData
provide('widget', widget) // hmm this is repeat code and doesen't cause an error when not used, so I think I should do v-bind:widget=widget to Wiget.vue instead...

</script>
<template>
	<Widget>
		<template #toolbar>
			<WidgetToolbar @close="widgetStore.deleteWidget(widget)">
				<template #title> Graph </template>
			</WidgetToolbar>
		</template>
		<template #content>
			<div class="content">
				<GraphContent></GraphContent>
				<GraphBottomBar></GraphBottomBar>
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
