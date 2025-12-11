<script setup lang="ts">
import PopMenu from '@/components/ui/PopMenu.vue'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { GraphData, ExpressionData, graphColors } from '@/utils/widgetData'
import { nextTick, ref } from 'vue'

const props = defineProps<{
	id: string
}>()
const widgetStore = useWidgetStore()
const widget = widgetStore.getWidgetById(props.id)
if (!(widget instanceof GraphData)) throw new Error('this aint no graph')

function convertToExpression(expression: ExpressionData) {
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
	<div class="expressionList" v-if="widget.expressions.length > 0">
		<div
			class="expression-container"
			v-for="expression in widget.expressions"
			:key="expression.id"
			:style="{ border: `2px solid ${expression.graphColor}` }"
		>
			<!-- expression -->
			<vue-mathjax
				:formula="`$$${expression.latex}$$`"
				class="typeset-expression"
				:options="{ messageStyle: 'none' }"
			/>

			<!-- menu for options -->
			<PopMenu :closeOnClick="true">
				<template #activator>
					<div class="popmenu-activator">
						<img class="three-dot-image" src="/assets/vertical-dots.svg" />
					</div>
				</template>
				<template #menu>
					<div class="colorMenu">
						<svg class="color-svg" v-for="color in graphColors.values()">
							<circle class="color-circle" :fill="color" @click="changeColor(expression, color)"></circle>
						</svg>
					</div>
					<div class="popmenu-button" @click="convertToExpression(expression)">Convert to Expression</div>
					<div class="popmenu-button" @click="widget.deleteExpression(expression)" style="color: red">
						Delete
					</div>
				</template>
			</PopMenu>
		</div>
	</div>
</template>

<style scoped>
.colorMenu {
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	gap: 5px;
	width: 100%;
	justify-content: space-between;
	border-bottom: 2px solid lightgray;
}

.color-svg {
	width: 26px;
	height: 26px;
	/* position: relative; */
}

.color-svg::after {
	content: '';
	background-color: red;
	position: absolute;
	top: 10px;
	/*
	width: 26px;
	height: 26px;
	top: -1px;
	outline: 2px solid red;
	background: red;
	border-radius: 100px;
	outline-offset: 1px; */
}

.color-svg:hover {
	outline: 3px solid gray;
	border-radius: 100px;
	outline-offset: -3px;
}

.color-circle {
	cx: 13;
	cy: 13;
	r: 12;
}

.expressionList {
	margin: 0.2em;
	margin-left: 0.1em;
	display: flex;
	flex-direction: row;
	gap: 0.3em;
	position: relative;
	width: 100%;
	min-height: 0px;
}

.expression-container {
	box-sizing: border-box;

	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;

	/* border: 2px solid red; */
	border-radius: 0.5em;
}

.typeset-expression {
	margin: 5px;
}

.popmenu-activator {
	display: flex;
	align-items: center;
	justify-content: center;

	margin: 3px;

	background-color: rgb(221, 221, 221);
	border-radius: 3px;

	transition: background ease-in-out 0.1s;
}

.popmenu-activator:hover {
	background-color: rgb(184, 184, 184);
}

.three-dot-image {
	height: 1.2em; /* small consistent size */
	width: auto; /* preserve aspect ratio */
	display: block; /* remove inline descender whitespace */
	margin: 0 auto; /* horizontally center */
	object-fit: contain;
	padding: 0.2em;
}
</style>
