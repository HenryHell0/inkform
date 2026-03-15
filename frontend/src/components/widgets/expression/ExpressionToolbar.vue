<script setup lang="ts">
import type { Widget } from '@/utils/widgetData'
import WidgetToolbar from '../toolbar/WidgetToolbar.vue'
import WidgetToolbarButton from '../toolbar/WidgetToolbarButton.vue'
import WidgetToolbarSection from '../toolbar/WidgetToolbarSection.vue'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { inject } from 'vue'

const widget = inject<Widget>('widget')!
const widgetStore = useWidgetStore()
</script>

<template>
	<WidgetToolbar :close="() => widgetStore.deleteWidget(widget.id)">
		<template #title> Expression </template>
		<template #content> buttons go here... </template>
	</WidgetToolbar>
</template>
<style scoped lang="css"></style>
