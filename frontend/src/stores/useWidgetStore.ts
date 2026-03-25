import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Widget } from '@/utils/widgetData.js'
import { useSessionStore } from './useSessionStore'

export const useWidgetStore = defineStore('widgets', () => {
	const widgets = ref<Widget[]>([])
	const zIndexCount = ref<number>(2)

	function addWidget(widgetData: Widget) {
		widgets.value.push(widgetData)
	}
	function getWidgetById(id: string): Widget {
		const widget = widgets.value.find((e) => e.id === id)
		if (!widget) throw new Error('Widget not found')
		return widget as Widget
	}
	function getHeldWidget(): Widget {
		const sessionStore = useSessionStore()
		if (!sessionStore.heldWidgetId) throw new Error("no held widget")
		const widget = getWidgetById(sessionStore.heldWidgetId)
		return widget
	}

	function deleteWidget(id: string) {
		// this should use history actions in the future
		widgets.value = widgets.value.filter((e) => e.id != id)
	}

	function bringWidgetToFront(widget: Widget) {
		zIndexCount.value++
		widget.zIndex = zIndexCount.value
	}

	return { widgets, zIndexCount, getWidgetById, getHeldWidget, deleteWidget, addWidget, bringWidgetToFront }
})
