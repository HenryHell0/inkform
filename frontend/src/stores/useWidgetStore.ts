import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Widget, WidgetData } from '@/utils/widgetData.js'
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

	function addWidget(widgetData: Widget) {
		executeAction(new AddWidgetAction(widgetData))
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

	function getCollidingWidgets(widgetId: string): Widget[] {
		const target = getWidgetById(widgetId)
		if (!target) return []

		return widgets.value.filter((other): other is Widget => {
			if (other.id === widgetId) return false

			const overlapX = target.x < other.x + other.width && target.x + target.width > other.x
			const overlapY = target.y < other.y + other.height && target.y + target.height > other.y

			return overlapX && overlapY
		})
	}

	function deleteWidget(id: string) {
		executeAction(new RemoveWidgetAction(getWidgetById(id)))
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
		deleteWidget,
		addWidget,
		bringWidgetToFrontSilently,
		bringWidgetToFrontIfNeeded
	}
})
