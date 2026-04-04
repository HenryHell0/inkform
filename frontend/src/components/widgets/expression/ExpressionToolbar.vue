<script setup lang="ts">
import { PopoverRoot, PopoverTrigger, PopoverPortal, PopoverContent, PopoverClose, PopoverArrow } from 'reka-ui'
import type { ExpressionData, Widget } from '@/utils/widgetData'
import WidgetToolbar from '../toolbar/WidgetToolbar.vue'
import WidgetToolbarButton from '../toolbar/WidgetToolbarButton.vue'
import WidgetToolbarSection from '../toolbar/WidgetToolbarSection.vue'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { inject, ref } from 'vue'
import CopyToClipboardToast from '@/components/ui/toasts/copyToClipboardToast.vue'

const expression = inject<Widget>('widget')! as ExpressionData
const widgetStore = useWidgetStore()

const copyToastOpen = ref<boolean>(false)

function handleCopy() {
	copyToastOpen.value = true
	expression.copyLatex()
	const timeoutMs = 800;
	setTimeout(() => {
		copyToastOpen.value = false
	}, timeoutMs)
}
</script>
<template>
	<WidgetToolbar @close="widgetStore.deleteWidget(expression.id)">
		<template #title> Expression </template>
		<template #content>
			<WidgetToolbarSection>
				<WidgetToolbarButton @pointerup="expression.convertToGraph()">
					<img src="/public/assets/graph.svg" draggable="false" />
				</WidgetToolbarButton>
				<WidgetToolbarButton @pointerup="handleCopy()">
					<img src="/public/assets/copy.svg" draggable="false" />
					<CopyToClipboardToast v-model:open="copyToastOpen"></CopyToClipboardToast>
				</WidgetToolbarButton>
			</WidgetToolbarSection>
		</template>
	</WidgetToolbar>
</template>
<style scoped lang="css"></style>
