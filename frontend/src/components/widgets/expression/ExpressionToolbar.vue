<script setup lang="ts">
import { TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent, TooltipArrow } from 'reka-ui'
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
const copyTimeout = ref<number | null>(null)
const timeoutMs = 1300

function handleCopy() {
	copyUIOpen.value = true
	copyTimeout.value = null
	expression.copyLatex()

	copyTimeout.value = setTimeout(() => {
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
				<TooltipRoot :open="copyUIOpen">
					<TooltipTrigger as-child>
						<WidgetToolbarButton
							class="copy-button"
							:data-state="copyUIOpen ? 'success' : 'idle'"
							@pointerup="handleCopy()"
						>
							<img class="copy" src="/public/assets/copy.svg" draggable="false" />
							<!-- !!! TODO POSITIONING AND BORDERS ARE TWEAKING!  maybe..??-->
							<img class="check" src="/public/assets/check.svg" draggable="false" />
							<CopyToClipboardToast v-model:open="copyUIOpen"></CopyToClipboardToast>
						</WidgetToolbarButton>
					</TooltipTrigger>
					<TooltipPortal>
						<TooltipContent class="tooltip-content" side="top">
							Copied!
							<TooltipArrow class="tooltip-arrow" :width="14" :height="7"/>
						</TooltipContent>
					</TooltipPortal>
				</TooltipRoot>
			</WidgetToolbarSection>
		</template>
	</WidgetToolbar>
</template>
<style scoped lang="css">
.copy-button {
	position: relative;
	--rotation: 120deg;
}

.copy-button > img {
	position: absolute;
	inset: 0;
	transition: all 0.3s cubic-bezier(0.2, -0.4, 0.8, 1.4);
}

.copy {
	opacity: 1;
}

.check {
	opacity: 0;
	transform: scale(0) rotate(calc(-1 * var(--rotation)));
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
	transform: scale(0) rotate(var(--rotation));
}

.copy-button[data-state='success'] .check {
	opacity: 1;
	transform: scale(1) rotate(0deg);
}

:deep(.tooltip-content) {
	--color-bg: var(--color-gray-800);
	/* border: 2px solid var(--color-border); */
	border-radius: 5px;
	background: var(--color-bg);
	color: white;

	pointer-events: none;
	user-select: none;
	-webkit-user-select: none;

	--padding: 5px;
	padding-top: var(--padding);
	padding-bottom: var(--padding);
	padding-left: calc(var(--padding) * 2);
	padding-right: calc(var(--padding) * 2);

	/* animate */
	transform-origin: bottom center;
	transition: all 1s cubic-bezier(0.2, -0.5, 0.8, 1.5);
}

:deep(.tooltip-content)[data-state='instant-open'] {
	transform: scaleY(1);
}
:deep(.tooltip-content)[data-state='closed'] {
	transform: scaleY(0);
}

:deep(.tooltip-arrow) {
	fill: var(--color-bg);
}
</style>
