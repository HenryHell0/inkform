<script setup lang="ts">
import { inject, toRef } from 'vue'
import { ExpressionData, type Widget } from '@/utils/widgetData'

const widget = inject<Widget>("widget")! as ExpressionData

const latex = toRef(widget, 'latex')
</script>
<template>
	<div class="content">
		<vue-mathjax
			v-if="typeof latex == 'string'"
			:formula="`$$${latex}$$`"
			class="expression"
			:options="{ messageStyle: 'none' }"
		/>
		<div v-else class="loading">loading...</div>
	</div>
</template>
<style scoped>
.content {
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;

	width: 100%;
	height: 100%;
}

.expression :deep(.MathJax) {
	/*!!!!!!! we antucally dont need this (whoa)*/
	display: flex;
	justify-content: center;
	align-items: center;
	/* width: 100%;
		height: 100%; */
	font-size: clamp(1em, 400vh, 400%);
	transform: translateY(-10px);
}
</style>
