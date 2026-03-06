import { defineStore } from 'pinia'
import { ref, markRaw, type Component } from 'vue'

type ActiveDialog = {
	name: string
	props?: Record<string, unknown>
}

export const useDialogStore = defineStore('dialog', () => {
	const dialogRegistry = ref<Record<string, Component>>({})
	const openDialogs = ref<ActiveDialog[]>([])

	function registerDialog(name: string, component: Component) {
		dialogRegistry.value[name] = markRaw(component)

		return {
			open: (props?: Record<string, unknown>) => openDialog(name, props),
			close: () => closeDialog(name),
		}
	}

	function openDialog(name: string, props?: Record<string, unknown>) {
		if (!dialogRegistry.value[name]) throw new Error(`Dialog "${name}" not registered`)
		if (openDialogs.value.some((d) => d.name === name)) throw new Error(`Dialog "${name}" already open`)

		openDialogs.value.push(props ? { name, props } : { name }) // ternary fixes TS error because props is optional
	}

	function closeDialog(name: string) {
		openDialogs.value = openDialogs.value.filter((d) => d.name !== name)
	}

	return {
		dialogRegistry,
		openDialogs,
		registerDialog,
		openDialog,
		closeDialog,
	}
})
