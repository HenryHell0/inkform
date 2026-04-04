<script setup lang="ts">
import { ToastRoot, ToastTitle } from 'reka-ui'

const open = defineModel<boolean>('open', { required: true })
</script>
<template>
	<ToastRoot v-drawing-opacity v-model:open="open" class="toast-root">
		<ToastTitle class="toast-title">🎉 Copied Successfully</ToastTitle>
	</ToastRoot>
</template>
<style lang="css">
.toast-root {
	background-color: var(--color-slate-900);
	border-radius: 6px;
	box-shadow:
		hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
		hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
	padding-top: 15px;
	padding-bottom: 15px;
	padding-left: 30px;
	padding-right: 30px;
}

.toast-title {
	font-weight: 500;
	color: var(--color-white);
	font-size: 15px;
}

/* open/close */
.toast-root[data-state='open'] {
	animation: slideIn 100ms ease-in;
}
.toast-root[data-state='closed'] {
	animation: slideOut 80ms ease-in;
}

/* swiping it out */
.toast-root[data-swipe='move'] {
	transform: translateX(var(--reka-toast-swipe-move-x));
}
.toast-root[data-swipe='cancel'] {
	transform: translateX(0);
	transition: transform 200ms ease-out;
}
.toast-root[data-swipe='end'] {
	animation: swipeOut 100ms ease-out;
}

@keyframes slideOut {
	from {
		transform: translateX(0);
	}
	to {
		transform: translateX(calc(100% + var(--viewport-padding)));
	}
}

@keyframes slideIn {
	from {
		transform: translateX(calc(100% + var(--viewport-padding)));
	}
	to {
		transform: translateX(0);
	}
}

@keyframes swipeOut {
	from {
		transform: translateX(var(--reka-toast-swipe-end-x));
	}
	to {
		transform: translateX(calc(100% + var(--viewport-padding)));
	}
}
</style>
