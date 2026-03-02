import { useCanvasStore } from '@/stores/useCanvasStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { useWidgetStore } from '@/stores/useWidgetStore'
import type { Path, Position } from '@/types/types'


export function executeAction (action: Action) {
	useHistoryStore().execute(action)
}

export interface Action {
	do(): void
	undo(): void
}

export class AddPathAction implements Action {
	constructor(private path: Path) {}

	do() {
		const canvasStore = useCanvasStore()
		canvasStore.paths.push(this.path)
	}

	undo() {
		const canvasStore = useCanvasStore()
		canvasStore.paths = canvasStore.paths.filter((p) => p.id !== this.path.id)
	}
}
export class RemovePathAction implements Action {
	constructor(private path: Path) {}

	do() {
		const canvasStore = useCanvasStore()
		canvasStore.paths = canvasStore.paths.filter((p) => p.id !== this.path.id)
	}

	undo() {
		const canvasStore = useCanvasStore()
		canvasStore.paths.push(this.path)
	}
}
export class MoveWidgetAction implements Action {
	constructor(
		private id: string,
		private from: Position,
		private to: Position,
	) {}

	do() {
		const widgetstore = useWidgetStore()
		const widget = widgetstore.getWidgetById(this.id)
		widget.x = this.to.x
		widget.y = this.to.y
	}
	undo() {
		const widgetstore = useWidgetStore()
		const widget = widgetstore.getWidgetById(this.id)
		widget.x = this.from.x
		widget.y = this.from.y
	}
}
