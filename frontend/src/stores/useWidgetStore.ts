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
	function getHeldWidget(): Widget {
		const sessionStore = useSessionStore()
		if (!sessionStore.heldWidgetId) throw new Error('no held widget')
		const widget = getWidgetById(sessionStore.heldWidgetId)
		return widget
	}

	function getCollidingWidgets(widget: Widget): Widget[] {
		return widgets.value.filter((other): other is Widget => {
			if (other.id === widget.id) return false

			const overlapX = widget.x < other.x + other.width && widget.x + widget.width > other.x
			const overlapY = widget.y < other.y + other.height && widget.y + widget.height > other.y

			return overlapX && overlapY
		})
	}

	// we might want to change this to using bounding boxes and data directly for the pannable viewport
	function getWidgetsFromPoint(clientX: number, clientY: number) {
		const elements = document.elementsFromPoint(clientX, clientY)

		const widgets: Widget[] = []
		const seenIds = new Set<string>()

		for (const el of elements) {
			if (!(el instanceof HTMLElement)) continue

			const id = el.dataset.widgetId
			if (!id) continue
			if (seenIds.has(id)) continue

			const widget = getWidgetById(id)

			seenIds.add(id)
			widgets.push(widget)
		}

		return widgets
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
		getHeldWidget,
		getCollidingWidgets,
		getWidgetsFromPoint,
		deleteWidget,
		addWidget,
		bringWidgetToFrontSilently,
		bringWidgetToFrontIfNeeded,
	}
})
