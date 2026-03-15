<script setup lang="ts">
import ExpressionContent from './ExpressionContent.vue'
import LoadingBar from '@/components/ui/LoadingBar.vue'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { ExpressionData } from '@/utils/widgetData'
import { onMounted, provide, ref, watch, type Ref } from 'vue'
import ExpressionToolbar from './ExpressionToolbar.vue'
import Widget from '../Widget.vue'

const props = defineProps<{
	id: string
}>()
const widgetStore = useWidgetStore()
const widget = widgetStore.getWidgetById(props.id)
if (!(widget instanceof ExpressionData)) throw new Error('this aint no expression!')

// provide widget for childen
provide('widget', widget)

// initial check if LaTeX is loaded
// TODO eventually this will all be extracted to a scalable (callback-based?) async composable thing, where you just pass around stuff and when it's done then everything works. no need for this manual stuff.
const loadingBar: Ref<InstanceType<typeof LoadingBar> | null> = ref(null)
onMounted(() => {
	if (!loadingBar.value) throw new Error('loadingbar is not defined :(')

	// initial check
	if (typeof widget.latex == 'string') {
		loadingBar.value.finishLoading()
	}
})

// could I stop the watcher when it loads? saves performance later ... ?
watch(
	() => widget.latex,
	(latex) => {
		// if the LaTeX is now defined, finish loading!
		if (latex) {
			if (!loadingBar.value) throw new Error('loadingbar is not defined :(')
			loadingBar.value.finishLoading()
		}
	},
)
</script>
<template>
	<Widget>
		<!-- TOOLBAR -->
		<template #toolbar>
			<ExpressionToolbar />
		</template>

		<!-- CONTENT -->
		<template #content>
			<ExpressionContent />
			<LoadingBar ref="loadingBar" class="loading-bar" />
		</template>
	</Widget>
</template>
<style scoped>
.loading-bar {
	height: 10px;
	position: absolute;
	bottom: 0px;
	right: 0px;
}
</style>
