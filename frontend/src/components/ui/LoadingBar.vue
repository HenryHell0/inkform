<script setup lang="ts">
import { watch, onMounted, ref } from 'vue'

// ======= CONFIG! =========== (could also change width and stuff)
const initialLoadTo = 95
const initialLoadRate = 0.01
const fastLoadRate = 0.2
const fadeOutDurationSeconds = 0.2
// =========================

const visible = ref(false)
const displayedProgress = ref(0)
const targetProgress = ref(0)
const isFadingOut = ref(false)

function animateWidth() {
	if (!visible.value) return

	// slow rate if getting to the initial, fast at the end
	let rate = initialLoadRate
	if (targetProgress.value == 100) rate = fastLoadRate

	displayedProgress.value += (targetProgress.value - displayedProgress.value) * rate
	requestAnimationFrame(animateWidth)
}

function fadeOut() {
	isFadingOut.value = true

	// remove after it's invisible
	setTimeout(() => {
		visible.value = false
		// isFadingOut.value = false
		displayedProgress.value = 0
		targetProgress.value = 0
	}, fadeOutDurationSeconds * 1000)
}

function startLoading() {
	visible.value = true
	displayedProgress.value = 0

	// load to the initial value
	targetProgress.value = initialLoadTo

	requestAnimationFrame(animateWidth)
}

function finishLoading() {
	targetProgress.value = 100

	// after displayed reaches ~99%, fade out
	watch(displayedProgress, (value) => {
		if (value >= 99.99) {
			fadeOut()
		}
	})
}
// EXPOSE FINISH 🔥
defineExpose({
    finishLoading
})

onMounted(() => {
	startLoading()
})
</script>

<template>
	<div
		v-if="visible"
		ref="wrapper"
		class="progress-wrapper"
		:class="{ 'fading-out': isFadingOut }"
		:style="{ '--fade-out-duration': fadeOutDurationSeconds + 's' }"
	>
		<div class="progress-bar" :style="{ width: displayedProgress + '%' }"></div>
	</div>
</template>

<style scoped>
/* loading bar styles */
.progress-wrapper {
	width: 100%;
	height: 20px;
	border-bottom-left-radius: inherit;
	border-bottom-right-radius: inherit;

	background: transparent;
	overflow: hidden;
	transition: opacity var(--fade-out-duration) ease;
}

.progress-wrapper.fading-out {
	opacity: 0;
}

.progress-bar {
	background: rgb(105, 145, 221);
	margin: 0;
	padding: 0;
	height: 100%;

	transition: width 0.1s linear;
}
</style>
