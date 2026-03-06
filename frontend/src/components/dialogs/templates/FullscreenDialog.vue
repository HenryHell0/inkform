<script setup lang="ts">
const props = defineProps<{
	close: () => void
}>()
</script>

<template>
	<div class="backdrop" @click="close">
		<div class="container" @click.stop>
			<slot></slot>
		</div>
	</div>
</template>
<style scoped lang="css">
.backdrop {
	z-index: 1000;

	position: fixed;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
	display: flex;

	justify-content: center;
	align-items: center;

	backdrop-filter: blur(3px);
	background-color: rgba(177, 177, 177, 0.5);
}

.container {
	width: 400px;
	min-width: 10em;
	border: 2px solid var(--color-zinc-500);
	border-radius: 5px;
	background: var(--color-bg-0);

	text-align: center;
	padding: 20px;
}
</style>
