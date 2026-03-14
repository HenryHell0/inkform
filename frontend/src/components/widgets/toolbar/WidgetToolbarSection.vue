<script setup lang="ts"></script>
<template>
	<div class="section">
		<slot></slot>
	</div>
</template>
<style scoped lang="css">
.section {
	--margin-top-bottom: 1px;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);

	background-color: var(--color-gray-50);
	border-radius: 5px;
	margin-top: var(--margin-top-bottom);
	margin-bottom: var(--margin-top-bottom);

	box-sizing: border-box;
	height: calc(100% - 2 * var(--margin-top-bottom));
	padding-top: 1px;
	padding-bottom: 1px;

	display: flex;
	padding: 1px;
}
</style>
