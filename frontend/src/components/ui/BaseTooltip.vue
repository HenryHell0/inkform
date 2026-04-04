<!-- your-tooltip.vue  -->
<script setup lang="ts">
import type { TooltipRootEmits, TooltipRootProps } from 'reka-ui'
import { TooltipPortal, TooltipArrow, TooltipContent, TooltipRoot, TooltipTrigger, useForwardPropsEmits } from 'reka-ui'

const props = defineProps<TooltipRootProps & { content?: string}>()
const emits = defineEmits<TooltipRootEmits>()

const forward: Partial<ReturnType<typeof useForwardPropsEmits>> = useForwardPropsEmits(props, emits)
</script>
<template>
	<TooltipRoot v-bind="forward" :open="props.open">
		<!-- <TooltipRoot :open="copyUIOpen"> -->
		<TooltipTrigger as-child>
			<slot />
		</TooltipTrigger>
		<TooltipPortal>
			<TooltipContent class="tooltip-content" side="top">
				{{ content }}
				<TooltipArrow class="tooltip-arrow" :width="14" :height="7" />
			</TooltipContent>
		</TooltipPortal>
	</TooltipRoot>
</template>
<style lang="css" scoped>
/* animation doesen't work rn */
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
