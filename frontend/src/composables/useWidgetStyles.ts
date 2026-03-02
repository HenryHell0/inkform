import { computed } from 'vue'
import type { Widget } from '@/utils/widgetData'

export function useWidgetStyles(widget: Widget) {
	return computed(() => {
		return {
			// left: `${widget.x}px`,
			// top: `${widget.y}px`,
			transform: `translate(${widget.x}px, ${widget.y}px)`, // apparently this is better performance says chat
			width: `${widget.width}px`,
			height: `${widget.height}px`,
			zIndex: widget.zIndex,
		}
	})
}
