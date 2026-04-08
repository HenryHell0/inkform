<script setup lang="ts">
import type { ExpressionData, Widget } from '@/utils/widgetData'
import WidgetToolbar from '../toolbar/WidgetToolbar.vue'
import WidgetToolbarButton from '../toolbar/WidgetToolbarButton.vue'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { inject } from 'vue'
import { ConvertExpressionToGraphAction, executeAction } from '@/utils/actions'
import { useCopyTextWithUI } from '@/composables/useCopyTextWithUI'
import SwapImages from '@/components/ui/SwapImages.vue'
import { useAnalytics } from '@/composables/useAnalytics'

const expression = inject<Widget>('widget')! as ExpressionData
const widgetStore = useWidgetStore()

function convertToGraph(){
	executeAction(new ConvertExpressionToGraphAction(expression))

	// ====== log analytics for grahping expression
	useAnalytics().logGraphExpression()
}

const { copy, copyUIOpen } = useCopyTextWithUI(expression.latex)
</script>
<template>
	<WidgetToolbar @close="widgetStore.deleteWidget(expression.id)">
		<template #title> Expression </template>
		<template #content>
			<WidgetToolbarButton @pointerup="convertToGraph()">
				<img src="/assets/graph.svg" draggable="false" />
			</WidgetToolbarButton>
			<WidgetToolbarButton @pointerup="copy()">
				<SwapImages :state="copyUIOpen ? 'success' : 'idle'">
					<img src="/assets/copy.svg" draggable="false" />
					<template #success><img src="/assets/check.svg" draggable="false" /></template>
				</SwapImages>
			</WidgetToolbarButton>
		</template>
	</WidgetToolbar>
</template>
<style scoped lang="css"></style>
