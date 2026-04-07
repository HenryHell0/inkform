<script setup lang="ts">
import PopMenu from '@/components/ui/PopMenu.vue'
import SwapImages from '@/components/ui/SwapImages.vue'
import { useCopyTextWithUI } from '@/composables/useCopyTextWithUI'
import { useCanvasStore } from '@/stores/useCanvasStore'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { ChangeGraphColorAction, EditWidgetAction, executeAction } from '@/utils/actions';
import { GraphData, ExpressionData, graphColors } from '@/utils/widgetData'
import Graph from './Graph.vue'
import GraphBottomBarExpression from './GraphBottomBarExpression.vue'

const props = defineProps<{
	id: string
}>()
const widgetStore = useWidgetStore()
const widget = widgetStore.getWidgetById(props.id) as GraphData

function changeColor(expressionId: string, color: string) {
	widget.changeGraphColor(expressionId, color)
}
</script>
<template>
	<div class="expression-list" v-if="widget.expressions.length > 0">
		<div class="expression-container" v-for="expression in widget.expressions" :key="expression.id">
			<GraphBottomBarExpression
				:expression="expression"
				@changeColor="(expression, color) => changeColor(expression.id, color)"
				@convertToExpressionWidget="(expression) => widget.exportExpression(expression.id)"
				@deleteExpression="(expression) => widget.deleteExpression(expression.id)"
			></GraphBottomBarExpression>
		</div>
	</div>
</template>

<style scoped>
.expression-list {
	margin: 4px;
	display: flex;
	align-items: center;
	flex-direction: row;
	gap: 4px;
	position: relative;
	width: 100%;
	min-height: 0px;
}
</style>
