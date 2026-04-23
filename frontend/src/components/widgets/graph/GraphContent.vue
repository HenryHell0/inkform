<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { ExpressionData, GraphData, type Widget } from '@/utils/widgetData'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { useSessionStore } from '@/stores/useSessionStore'

const widgetStore = useWidgetStore()
const sessionStore = useSessionStore()
const widget = inject<Widget>('widget') as GraphData
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

const showOverlay = computed(() => {
	const held = sessionStore.heldWidget
	const hovered = sessionStore.hoveredWidgetsDuringDrag

	return held instanceof ExpressionData && hovered[1]?.id == widget.id
	// return true
})
</script>
<template>
	<div class="wrapper">
		<div ref="graphElement" class="graph"></div>
		<div class="overlay" :class="{ shown: showOverlay }">
			<div class="overlay-background"></div>
			<div class="overlay-text">Drop here to graph!</div>
		</div>
	</div>
</template>
<style scoped>
.wrapper {
	position: relative;
	width: 100%;
	height: 100%;
	border-bottom: 2px solid rgb(175, 175, 175);
}

.graph {
	position: absolute;
	width: 100%;
	height: 100%;

	border-bottom: 2px solid rgb(175, 175, 175);
}

.overlay {
	pointer-events: none;
	position: absolute;
	width: 100%;
	height: 100%;
	container-type: size;

	--animation-speed: 0.2s;
}

.overlay.shown {
	opacity: 1;
}

.overlay-background {
	position: absolute;
	width: 100%;
	height: 100%;

	will-change: backdrop-filter;

	 backdrop-filter: blur(6px);
	background-color: rgba(184, 184, 184, 0.3);
	/* background-color: red; */
	mask-image: radial-gradient(circle, black clamp(37px, 30%, 30%), transparent clamp(60px, 60%, 60%));

	opacity: 0;
	transition: opacity var(--animation-speed) ease;
}

.overlay.shown .overlay-background {
	opacity: 1;
}

.overlay-text {
	position: absolute;
	width: 100%;
	height: 100%;

	align-content: center;
	text-align: center;
	font-size: clamp(1rem, 5cqw, 1.8rem);
	overflow: hidden;
	text-wrap: nowrap;

	opacity: 0;
	transition: opacity var(--animation-speed) ease;
}

.overlay.shown .overlay-text {
	opacity: 1;
}
</style>
