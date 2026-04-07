<script setup lang="ts">
import PopMenu from '@/components/ui/PopMenu.vue'
import SwapImages from '@/components/ui/SwapImages.vue'
import { useCopyTextWithUI } from '@/composables/useCopyTextWithUI'
import { ExpressionData, graphColors } from '@/utils/widgetData'

const props = defineProps<{
	expression: ExpressionData
}>()

defineEmits<{
	// changeColor could probably just be done right here, but for actions merge conflicts it's best to just do the emit
	changeColor: [expression: ExpressionData, color: string]
	convertToExpressionWidget: [expression: ExpressionData]
	deleteExpression: [expression: ExpressionData]
}>()

// TODO manage copy state here
const { copy, copyUIOpen } = useCopyTextWithUI(props.expression.latex)
</script>
<template>
	<div class="expression-container" :style="{ border: `2px solid ${expression.graphColor}` }">
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

					<SwapImages :state="copyUIOpen ? 'success' : 'idle'">
						<img src="/assets/vertical-dots.svg" draggable="false" />
						<template #success><img src="/assets/check.svg" draggable="false" /></template>
					</SwapImages>
				</div>
			</template>
			<template #menu>
				<div class="colorMenu">
					<svg class="color-svg" v-for="color in graphColors.values()">
						<circle
							class="color-circle"
							:fill="color"
							@click="$emit('changeColor', expression, color)"
						></circle>
					</svg>
				</div>
				<div class="popmenu-button" @click="$emit('convertToExpressionWidget', expression)">
					Convert to Expression
				</div>
				<div class="popmenu-button" @click="copy()">Copy</div>
				<div class="popmenu-button delete-button" @click="$emit('deleteExpression', expression)">
					Delete
				</div>
			</template>
		</PopMenu>
	</div>
</template>

<style scoped>
.expression-container {
	box-sizing: border-box;

	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;

	padding: 2px;
	gap: 2px;

	/* border: 2px solid red; */
	border-radius: 0.5em;
}

.typeset-expression {
	margin: 4px;
	margin-left: 6px;
	margin-right: 6px;
	transform: scale(1.1);
}

.popmenu-activator {
	display: flex;
	align-items: center;
	justify-content: center;

	margin-right: 3px;
	width: 28px;
	aspect-ratio: 1/1;
	object-fit: contain;
	box-sizing: border-box;
	padding: 2px;

	background-color: var(--color-gray-200);
	border-radius: 4px;

	transition:
		background ease-in-out 0.1s,
		transform ease 0.2s;
}

.popmenu-activator img {
	width: 100%;
	height: 100%;
	display: block;
	object-fit: contain;
}

.popmenu-activator:hover {
	background-color: rgb(195, 195, 195);
	transform: scale(1.15);
}

.popmenu-activator:active {
	transform: scale(0.95);
}

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

	transition: transform 0.2s ease-in-out;
}

.color-svg::after {
	content: '';
	background-color: red;
	position: absolute;
	top: 10px;
}

.color-svg:hover {
	transform: scale(0.9);
}

.color-svg:active {
	transform: scale(0.8);
}

.color-circle {
	cx: 13;
	cy: 13;
	r: 12;
}

.delete-button {
	color: var(--color-danger);
}
</style>
