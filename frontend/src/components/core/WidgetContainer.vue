<script setup lang="ts">
import Widget from '@/components/widgets/widgetTemplate/Widget.vue'
import Expression from '@/components/widgets/widgetComponents/expression/Expression.vue'
import Graph from '@/components/widgets/widgetComponents/graph/Graph.vue'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { addTestWidgets } from '@/utils/debug'
import type { Component } from 'vue'
import type { WidgetName } from '@/utils/widgetData'

const widgetStore = useWidgetStore()

const widgetComponents: Record<WidgetName, Component> = {
	Expression: Expression,
	Graph: Graph,
}

addTestWidgets()
</script>
<template>
	<div class="widget-container">
		<Widget v-for="widget in widgetStore.widgets" :key="widget.id" :id="widget.id">
			<component :is="widgetComponents[widget.type]" :id="widget.id"></component>
		</Widget>
	</div>
</template>
<style scoped>
.widget-container {
	isolation: isolate;
}
</style>
