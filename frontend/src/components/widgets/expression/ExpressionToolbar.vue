<script setup lang="ts">
import type { ExpressionData, Widget } from '@/utils/widgetData'
import WidgetToolbar from '../toolbar/WidgetToolbar.vue'
import WidgetToolbarButton from '../toolbar/WidgetToolbarButton.vue'
import WidgetToolbarSection from '../toolbar/WidgetToolbarSection.vue'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { inject } from 'vue'
import { ConvertExpressionToGraphAction, executeAction } from '@/utils/actions'

const widget = inject<Widget>('widget')! as ExpressionData
const widgetStore = useWidgetStore()

function convertToGraph(){
	executeAction(new ConvertExpressionToGraphAction(widget))
}

</script>
<template>
	<WidgetToolbar :close="() => widgetStore.deleteWidget(widget.id)">
		<template #title> Expression </template>
		<template #content>
			<WidgetToolbarSection>
				<WidgetToolbarButton @pointerup="convertToGraph()">
					<img src="/public/assets/graph.svg" draggable="false"/>
				</WidgetToolbarButton>
			</WidgetToolbarSection>
		</template>
	</WidgetToolbar>
</template>
<style scoped lang="css"></style>
