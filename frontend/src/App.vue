<script setup>
import Toolbar from '@/components/core/toolbar/Toolbar.vue'
import WidgetContainer from '@/components/core/WidgetContainer.vue'
import OverlaySvg from '@/components/core/OverlaySvg.vue'
import MainCanvas from '@/components/core/MainCanvas.vue'
import DialogHost from './components/core/DialogHost.vue'
import { ToastProvider, ToastViewport } from 'reka-ui'
</script>
<template>
	<div class="template">
		<ToastProvider>
			<!-- dialog will be reka someday... -->
			<DialogHost></DialogHost>

			<Toolbar></Toolbar>
			<MainCanvas></MainCanvas>
			<OverlaySvg></OverlaySvg>
			<WidgetContainer></WidgetContainer>

			<!-- TOASTS -->
			<ToastViewport v-drawing-opacity class="toast-viewport" />
		</ToastProvider>
	</div>
</template>
