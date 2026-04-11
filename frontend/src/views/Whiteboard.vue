<!-- NOTE:
- eventually when we have multiple views, folder structure will get messed up since everything will all be in the same place, so we'll want to
	move reusable files somewhere, view-specific files somewhere, etc. (I think)
- but for now with only one view but the potential for more it's fine
-->
<script setup lang="ts">
import Toolbar from '@/components/core/toolbar/Toolbar.vue'
import WidgetContainer from '@/components/core/WidgetContainer.vue'
import OverlaySvg from '@/components/core/OverlaySvg.vue'
import MainCanvas from '@/components/core/MainCanvas.vue'
import { ToastProvider, ToastViewport, TooltipProvider } from 'reka-ui'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'


</script>
<template>
	<div class="template">
		<TooltipProvider>
			<ToastProvider>
				<!-- dialogs are route-based now! I think this will work! -->

				<Toolbar></Toolbar>
				<MainCanvas></MainCanvas>
				<OverlaySvg></OverlaySvg>
				<WidgetContainer></WidgetContainer>

				<!-- TOASTS -->
				<ToastViewport v-drawing-opacity class="toast-viewport" />
			</ToastProvider>
		</TooltipProvider>

		<RouterView />
	</div>
</template>

<!-- in the future this can be MainApp, and then App.vue will just be a RouterView so we can support other fullscreen routes! -->
