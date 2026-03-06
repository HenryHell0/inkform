<script setup lang="ts">
import { useDialogStore } from '@/stores/useDialogStore'
import { loadDialogs } from '../dialogs/registerDialogs'
import { onMounted } from 'vue'

loadDialogs()
const dialogStore = useDialogStore()
</script>
<template>
	<!-- issue with dialog stacking in the future FYI -->
	<component
		v-for="dialog in dialogStore.openDialogs"
		:key="dialog.name"
		:is="dialogStore.dialogRegistry[dialog.name]"
		v-bind="dialog.props"
	/>
</template>
