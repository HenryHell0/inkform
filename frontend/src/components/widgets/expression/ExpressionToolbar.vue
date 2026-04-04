<script setup lang="ts">
import type { ExpressionData, Widget } from '@/utils/widgetData'
import WidgetToolbar from '../toolbar/WidgetToolbar.vue'
import WidgetToolbarButton from '../toolbar/WidgetToolbarButton.vue'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { inject, ref } from 'vue'
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
				</WidgetToolbarButton>
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

.copy-button[data-state='success'] .copy {
	opacity: 0;
	transform: scale(0) rotate(var(--rotation));
}

.copy-button[data-state='success'] .check {
	opacity: 1;
	transform: scale(1) rotate(0deg);
}
</style>
