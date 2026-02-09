<script setup>
import Toolbar from '@/components/core/toolbar/Toolbar.vue'
import WidgetContainer from '@/components/core/WidgetContainer.vue'
import OverlaySvg from '@/components/core/OverlaySvg.vue'
import MainCanvas from '@/components/core/MainCanvas.vue'
import FeedbackDialog from './components/ui/FeedbackDialog.vue'
</script>

<template>
	<div class="template">
		<!-- dialogs and stuff -->
		<FeedbackDialog></FeedbackDialog>

		<Toolbar></Toolbar>

		<MainCanvas></MainCanvas>

		<OverlaySvg></OverlaySvg>

		<WidgetContainer></WidgetContainer>
	</div>
</template>

<style>

</style>
