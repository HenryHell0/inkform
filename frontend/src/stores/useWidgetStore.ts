import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Widget } from '@/utils/widgetData.js'
import { useSessionStore } from './useSessionStore'
import {
	AddWidgetAction,
	BringWidgetToFrontAction,
	executeAction,
	isWidgetCovered,
	RemoveWidgetAction,
} from '@/utils/actions'

export const useWidgetStore = defineStore('widgets', () => {
	const widgets = ref<Widget[]>([])
	const zIndexCount = ref<number>(2)

	function addWidget(widget: Widget) {
		executeAction(new AddWidgetAction(widget))
	}
	function getWidgetById(id: string): Widget {
		const widget = widgets.value.find((e) => e.id === id)
		if (!widget) throw new Error("Widget not found, perhaps it doesen't exist yet?")
		return widget as Widget
	}

	function getCollidingWidgets(widget: Widget): Widget[] {
		return widgets.value.filter((other): other is Widget => {
			if (other.id === widget.id) return false

			const overlapX = widget.x < other.x + other.width && widget.x + widget.width > other.x
			const overlapY = widget.y < other.y + other.height && widget.y + widget.height > other.y

			return overlapX && overlapY
		})
	}

	function getWidgetsFromPoint(x: number, y: number) {
		// this will break when we have pannable viewport, so we might want to use approach seen above in the comment
		return widgets.value
			.filter((w) => x >= w.x && x <= w.x + w.width && y >= w.y && y <= w.y + w.height)
			.sort((a, b) => b.zIndex - a.zIndex) // top → bottom
	}

	function deleteWidget(widget: Widget) {
		executeAction(new RemoveWidgetAction(widget))
	}

	function bringWidgetToFrontSilently(widget: Widget) {
		zIndexCount.value++
		widget.zIndex = zIndexCount.value
		return zIndexCount.value
	}

	function bringWidgetToFrontIfNeeded(widget: Widget) {
		if (isWidgetCovered(widget)) executeAction(new BringWidgetToFrontAction(widget))
	}

	return {
		widgets,
		zIndexCount,
		getWidgetById,
		getCollidingWidgets,
		getWidgetsFromPoint,
		deleteWidget,
		addWidget,
		bringWidgetToFrontSilently,
		bringWidgetToFrontIfNeeded,
	}
})
