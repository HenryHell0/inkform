<script setup lang="ts">
import type { ExpressionData, Widget } from '@/utils/widgetData'
import WidgetToolbar from '../toolbar/WidgetToolbar.vue'
import WidgetToolbarButton from '../toolbar/WidgetToolbarButton.vue'
import WidgetToolbarSection from '../toolbar/WidgetToolbarSection.vue'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { inject } from 'vue'

const expression = inject<Widget>('widget')! as ExpressionData
const widgetStore = useWidgetStore()

</script>
<template>
	<WidgetToolbar @close="widgetStore.deleteWidget(expression.id)">
		<template #title> Expression </template>
		<template #content>
			<WidgetToolbarSection>
				<WidgetToolbarButton @pointerup="expression.convertToGraph()">
					<img src="/public/assets/graph.svg" draggable="false"/>
				</WidgetToolbarButton>
				<WidgetToolbarButton @pointerup="expression.copyLatex()">
					<img src="/public/assets/copy.svg" draggable="false"/>
				</WidgetToolbarButton>
			</WidgetToolbarSection>
		</template>
	</WidgetToolbar>
</template>
<style scoped lang="css"></style>
