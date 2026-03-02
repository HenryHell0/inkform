import { computed } from 'vue'
import type { Widget } from '@/utils/widgetData'

export function useWidgetStyles(widget: Widget) {
	return computed(() => {
		return {
			left: `${widget.x}px`,
			top: `${widget.y}px`,
			width: `${widget.width}px`,
			height: `${widget.height}px`,
			zIndex: widget.zIndex,
		}
	})
}
