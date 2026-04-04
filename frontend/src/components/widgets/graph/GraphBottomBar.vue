<script setup lang="ts">
import PopMenu from '@/components/ui/PopMenu.vue'
import SwapImages from '@/components/ui/SwapImages.vue'
import { useCopyTextWithUI } from '@/composables/useCopyTextWithUI'
import { useCanvasStore } from '@/stores/useCanvasStore'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { GraphData, ExpressionData, graphColors } from '@/utils/widgetData'
import Graph from './Graph.vue'
import GraphBottomBarExpression from './GraphBottomBarExpression.vue'

const props = defineProps<{
	id: string
}>()
const widgetStore = useWidgetStore()
const widget = widgetStore.getWidgetById(props.id)
if (!(widget instanceof GraphData)) throw new Error('this aint no graph')

function convertToExpressionWidget(expression: ExpressionData) {
	// remove expression from graph
	if (!(widget instanceof GraphData)) throw new Error('this aint no graph')
	widget.deleteExpression(expression)

	// set expression to be at the bottom.
	expression.x = widget.x
	expression.y = widget.y + widget.height + 12
	// if we removed all the expressions, put it at the top of the graph
	if (widget.expressions.length == 0) {
		expression.x = widget.x
		expression.y = widget.y
	}

	// add the widget to store
	widgetStore.addWidget(expression)

	// put it above (wait since this has an update afterwards)
	setTimeout(() => {
		widgetStore.bringWidgetToFront(expression)
	}, 1)
}

// function changecolor(expression: ExpressionData, color: string) {
// 	if (!(widget instanceof GraphData)) throw new Error('not a graph')
// 	// widget.calculator.
// }

function changeColor(expression: ExpressionData, color: string) {
	if (!(widget instanceof GraphData)) throw new Error("expression isn't expressioning")
	widget.changeGraphColor(expression, color)
}
</script>
<template>
	<div class="expression-list" v-if="widget.expressions.length > 0">
		<div class="expression-container" v-for="expression in widget.expressions" :key="expression.id">
			<GraphBottomBarExpression
				:expression="expression"
				@changeColor="(expression, color) => changeColor(expression, color)"
				@convertToExpressionWidget="(expression) => convertToExpressionWidget(expression)"
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
