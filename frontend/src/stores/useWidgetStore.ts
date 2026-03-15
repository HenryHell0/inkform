import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Widget } from '@/utils/widgetData.js'

export const useWidgetStore = defineStore('widgets', () => {
	const widgets = ref<Widget[]>([]) // widgetData is really ExpressionData or whatever, also is this syntax right?
	const zIndexCount = ref<number>(2)

	function addWidget(widgetData: Widget) {
		widgets.value.push(widgetData)
	}
	function getWidgetById(id: string): Widget {
		// this returns a full widget (expression or graph, not just flat widgetdata, so should it return just widgetData or what.)
		const widget = widgets.value.find((e) => e.id === id)
		if (!widget) throw new Error('Widget not found')
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

	return { widgets, zIndexCount, getWidgetById, deleteWidget, addWidget, bringWidgetToFront }
})
