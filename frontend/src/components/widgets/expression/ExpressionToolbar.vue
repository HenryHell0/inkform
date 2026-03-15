<script setup lang="ts">
import type { Widget } from '@/utils/widgetData'
import WidgetToolbar from '../toolbar/WidgetToolbar.vue'
import WidgetToolbarButton from '../toolbar/WidgetToolbarButton.vue'
import WidgetToolbarSection from '../toolbar/WidgetToolbarSection.vue'
import { useWidgetStore } from '@/stores/useWidgetStore'

const widgetStore = useWidgetStore()

defineProps<{
	isDragging: boolean
	widget: Widget
}>()
</script>

<template>
	<WidgetToolbar :close="() => widgetStore.deleteWidget(widget.id)" :isDragging>
		<template #title> Expression </template>
		<template #content> buttons go here... </template>
	</WidgetToolbar>
</template>
<style scoped lang="css"></style>
