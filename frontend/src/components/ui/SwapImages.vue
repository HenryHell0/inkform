<script setup lang="ts">
type State = 'idle' | 'success' | 'error'

const props = defineProps<{ state: State }>()
</script>

<template>
	<div class="swap-container" :data-state="state">
		<div class="swap-item idle">
			<slot name="default"> </slot>
		</div>

		<div class="swap-item success">
			<slot name="success"> </slot>
		</div>

		<div class="swap-item error">
			<slot name="error"> </slot>
		</div>
	</div>
</template>

<style scoped>
.swap-container {
	--rotation: 120deg;

	position: relative;
	width: 100%;
	aspect-ratio: 1/1;
}

.swap-item {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;

	transition: all 0.3s cubic-bezier(0.2, -0.4, 0.8, 1.4);
	opacity: 0;
	transform: scale(0) rotate(calc(-1 * var(--rotation)));
}

/* ensure images fill their container */
.swap-item :deep(img) {
	width: 100%;
	height: 100%;
	display: block;
	object-fit: contain;
}

/* default state is idle */
.swap-container[data-state='idle'] .idle {
	opacity: 1;
	transform: scale(1) rotate(0deg);
}

/* remove idle image on other event */
.swap-container[data-state='success'] .idle {
	opacity: 0;
	transform: scale(0) rotate(calc(var(--rotation)));
}
.swap-container[data-state='error'] .idle {
	opacity: 0;
	transform: scale(0) rotate(calc(var(--rotation)));
}

/* make success and error appear */
.swap-container[data-state='success'] .success {
	opacity: 1;
	transform: scale(1) rotate(0deg);
}
.swap-container[data-state='error'] .error {
	opacity: 1;
	transform: scale(1) rotate(0deg);
}
</style>
