<script setup lang="ts">
import FullscreenDialog from './templates/FullscreenDialog.vue'
import { useDialogStore } from '@/stores/useDialogStore'
const dialogStore = useDialogStore()
</script>
<template>
	<FullscreenDialog :close="() => dialogStore.closeDialog('info')">
		<h1>About Inkform</h1>
		<div class="text">
			Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum debitis corrupti perspiciatis
			quisquam illo eum temporibus adipisci, qui praesentium in libero velit neque accusantium incidunt
			consequatur quod eaque sit nostrum.
		</div>
	</FullscreenDialog>
</template>
<style scoped lang="css">
.text {
	text-align: center;
}
</style>
