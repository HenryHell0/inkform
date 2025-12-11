<script setup lang="ts">
import ExpressionContent from './ExpressionContent.vue'
import LoadingBar from '@/components/ui/LoadingBar.vue'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { ExpressionData } from '@/utils/widgetData'
import { onMounted, ref, watch, type Ref } from 'vue'

const props = defineProps<{
	id: string
}>()
const widgetStore = useWidgetStore()
const widget = widgetStore.getWidgetById(props.id)
if (!(widget instanceof ExpressionData)) throw new Error('this aint no expression!')

// initial check if LaTeX is loaded
const loadingBar: Ref<InstanceType<typeof LoadingBar> | null> = ref(null)
onMounted(() => {
	if (!loadingBar.value) throw new Error('loadingbar is not defined :(')

	// initial check
	if (typeof widget.latex == 'string') {
		loadingBar.value.finishLoading()
	}
})

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
	<ExpressionContent :id="props.id"></ExpressionContent>
	<LoadingBar ref="loadingBar" class="loading-bar"></LoadingBar>
</template>
<style scoped>
.loading-bar {
	height: 10px;
	position: absolute;
	bottom: 0px;
	right: 0px;
}
</style>
