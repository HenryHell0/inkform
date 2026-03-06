<script setup>
import Toolbar from '@/components/core/toolbar/Toolbar.vue'
import WidgetContainer from '@/components/core/WidgetContainer.vue'
import OverlaySvg from '@/components/core/OverlaySvg.vue'
import MainCanvas from '@/components/core/MainCanvas.vue'
import DialogHost from './components/core/DialogHost.vue'
</script>
<template>
	<div class="template">
		<DialogHost></DialogHost>
		<Toolbar></Toolbar>
		<MainCanvas></MainCanvas>
		<OverlaySvg></OverlaySvg>
		<WidgetContainer></WidgetContainer>
	</div>
</template>
