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

const copyUIOpen = ref<boolean>(false)

function handleCopy() {
	copyUIOpen.value = true
	expression.copyLatex()
	const timeoutMs = 1350
	setTimeout(() => {
		copyUIOpen.value = false
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
				<WidgetToolbarButton
					class="copy-button"
					:data-state="copyUIOpen ? 'success' : 'idle'"
					@pointerup="handleCopy()"
				>
					<img class="copy" src="/public/assets/copy.svg" draggable="false" />
					<img class="check" src="/public/assets/check.svg" draggable="false" />
					<CopyToClipboardToast v-model:open="copyUIOpen"></CopyToClipboardToast>
				</WidgetToolbarButton>
			</WidgetToolbarSection>
		</template>
	</WidgetToolbar>
</template>
<style scoped lang="css">
.copy-button {
	position: relative;
}

.copy-button > img {
	position: absolute;
	inset: 0;
	transition: all 0.3s ease;
}

.copy {
	opacity: 1;
}

.check {
	opacity: 0;
	transform: scale(0) rotate(90deg);
}

/* opacity change */
/* .copy-button[data-state='success'] .copy {
	opacity: 0;
	transform: scale(0.8);
}

.copy-button[data-state='success'] .check {
	opacity: 1;
	transform: scale(1);
} */

.copy-button[data-state='success'] .copy {
	opacity: 0;
	transform: scale(0) rotate(-90deg);
}

.copy-button[data-state='success'] .check {
	opacity: 1;
	transform: scale(1) rotate(0deg);
}
</style>
