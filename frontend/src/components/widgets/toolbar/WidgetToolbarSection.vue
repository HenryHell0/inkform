<script setup lang="ts"></script>
<template>
	<div class="section">
		<slot></slot>
	</div>
</template>
<style scoped lang="css">
.section {
	background-color: var(--color-gray-50);
	border-radius: 5px;

	display: flex;
	align-items: center;

	padding: 3px; /*space between buttons and edge of section */
	margin-top: 2px; /*space between section and edges of toolbar */
	margin-bottom: 2px;
	gap: 6px; /* space between elements*/
}
</style>
