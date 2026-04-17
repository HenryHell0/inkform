<script setup lang="ts">
import { useWidgetStore } from '@/stores/useWidgetStore'
import { ExpressionData, GraphData } from '@/utils/widgetData'
import GraphBottomBarExpression from './GraphBottomBarExpression.vue'

const props = defineProps<{
	id: string
}>()
const widgetStore = useWidgetStore()
const widget = widgetStore.getWidgetById(props.id) as GraphData

function changeColor(expression: ExpressionData, color: string) {
	widget.changeGraphColor(expression, color)
}
</script>
<template>
	<div class="expression-list" v-if="widget.expressions.length > 0">
		<div class="expression-container" v-for="expression in widget.expressions" :key="expression.id">
			<GraphBottomBarExpression
				:expression="expression"
				@changeColor="(expression, color) => changeColor(expression, color)"
				@convertToExpressionWidget="(expression) => widget.exportExpression(expression)"
				@deleteExpression="(expression) => widget.deleteExpression(expression)"
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
