<!-- ! FYI this is Fed. this should have like PopMenu and PopmenuButton and stuff imo.. right now it's all like css classes which is messy -->

<script setup lang="ts">
import { usePopMenu } from '@/composables/usePopMenu'
const props = withDefaults(
	defineProps<{
		closeOnClick: boolean
	}>(),
	{
		closeOnClick: false,
	},
)

const { isOpen, position, activatorElement, menuElement, toggle, menuClicked } = usePopMenu(props.closeOnClick)
</script>

<template>
	<div class="element">
		<!-- Activator Slot -->
		<div ref="activatorElement" class="activator" @click.stop="toggle">
			<slot name="activator" />
		</div>

		<!-- Menu -->
		<div
			v-if="isOpen"
			ref="menuElement"
			class="menu"
			:style="{ top: position.top + 'px', left: position.left + 'px' }"
			@click="menuClicked"
		>
			<!-- use class=popmenu-button for button styles :) -->
			<slot name="menu" />
		</div>
	</div>
</template>

<style scoped>
.element {
	display: inline-block;
}

.activator {
	cursor: pointer;
}

/* Floating menu */
.menu {
	position: fixed;
	background: white;
	border-radius: 6px;
	padding: 0 0;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.22);
	z-index: 99999;
	min-width: 120px;
}

.menu :deep(div) {
	padding: 8px 14px;
	white-space: nowrap;
}

.menu :deep(.popmenu-button) {
	cursor: pointer;
}

.menu :deep(.popmenu-button):hover {
	background: #f2f2f2;
}
</style>
