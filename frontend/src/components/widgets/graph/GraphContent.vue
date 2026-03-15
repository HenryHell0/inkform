<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { GraphData, type Widget } from '@/utils/widgetData'

const widget = inject<Widget>('widget')
const graphElement = ref<HTMLElement | null>(null)

onMounted(async () => {
	// check da ting
	if (!(widget instanceof GraphData)) throw new Error("this widget isn't a graph.")
	if (!graphElement.value) throw new Error('graphElement does not exist!!')

	// make da thing
	widget.calculator = Desmos.GraphingCalculator(graphElement.value, {
		expressions: false,
		border: false,
	})

	// set initial expression
	for (let expression of widget.expressions) {
		widget.calculator.setExpression({
			// could shor.this to just "graph" :) (see desmos api docs)
			latex: await expression.latex,
			color: expression.graphColor,
			id: expression.id,
		})
	}

	// see this
	// calculator.setMathBounds({
	// 	left: 0,
	// 	right: 10,
	// 	bottom: 0,
	// 	top: 10,
	// })
})
</script>
<template>
	<div ref="graphElement" class="graph"></div>
</template>
<style scoped>
.graph {
	width: 100%;
	height: 100%;

	border-bottom: 2px solid rgb(175, 175, 175);
}
</style>
