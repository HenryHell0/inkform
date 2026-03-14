<script setup lang="ts">
import type { Widget } from '@/utils/widgetData';
import WidgetToolbar from '../toolbar/WidgetToolbar.vue'
import WidgetToolbarButton from '../toolbar/WidgetToolbarButton.vue'
import WidgetToolbarSection from '../toolbar/WidgetToolbarSection.vue'
import { useWidgetStore } from '@/stores/useWidgetStore';

const widgetStore = useWidgetStore()


defineProps<{
	isDragging: boolean,
	widget: Widget,
}>()


defineEmits(['pointerdown'])
</script>

<template>
	<WidgetToolbar :close="() => widgetStore.deleteWidget(widget.id)" :isDragging="isDragging" @pointerdown="$emit('pointerdown', $event)">
		<template #title>
			Expression
		</template>
		buttons go here...
	</WidgetToolbar>
</template>
<style scoped lang="css"></style>
