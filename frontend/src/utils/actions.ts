import { useCanvasStore } from '@/stores/useCanvasStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { useWidgetStore } from '@/stores/useWidgetStore'
import type { Path, Position, Size } from '@/types/types'
import type { ExpressionData, Widget } from './widgetData'

export function executeAction(action: Action) {
	useHistoryStore().execute(action)
}

export function pushAction(action: Action) {
	useHistoryStore().push(action)
}

export interface Action {
	do(): void
	undo(): void
}

// =========================
//      ACTION GROUP
// =========================
export class ActionGroup implements Action {
	constructor(private actions: Action[]) {}

	do() {
		for (const a of this.actions) a.do()
	}

	undo() {
		for (const a of [...this.actions].reverse()) a.undo()
	}

	push(action: Action) {
		this.actions.push(action)
	}
}

// ================================
//      PATHS
// ================================
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
// ================================
//     WIDGETS
// ================================
export class MoveWidgetAction implements Action {
	constructor(
		private id: string,
		private from: Position,
		private to: Position,
	) {}

	do() {
		const widgetStore = useWidgetStore()
		const widget = widgetStore.getWidgetById(this.id)
		widget.x = this.to.x
		widget.y = this.to.y
	}
	undo() {
		const widgetStore = useWidgetStore()
		const widget = widgetStore.getWidgetById(this.id)
		widget.x = this.from.x
		widget.y = this.from.y
	}
}
export class ResizeWidgetAction implements Action {
	constructor(
		private id: string,
		private from: Size, // eventually if we implement non-bottom-right resizing these will be Rect objects
		private to: Size,
	) {}

	do() {
		const widgetStore = useWidgetStore()
		const widget = widgetStore.getWidgetById(this.id)
		widget.width = this.to.width
		widget.height = this.to.height
	}
	undo() {
		const widgetStore = useWidgetStore()
		const widget = widgetStore.getWidgetById(this.id)
		widget.width = this.from.width
		widget.height = this.from.height
	}
}

export class CreateWidgetAction implements Action {
	constructor(private widget: Widget) {} // NOTE this is storing widgets twice in memory now, but we should really just have a list of them and then like enable/disable them or something
	do() {
		const widgetStore = useWidgetStore()
		widgetStore.addWidget(this.widget)
	}

	undo() {
		const widgetstore = useWidgetStore()
		widgetstore.deleteWidget(this.widget.id)
	}
}

export class RemoveWidgetAction implements Action {
	constructor(private widget: Widget) {}
	do() {
		const widgetStore = useWidgetStore()
		widgetStore.deleteWidget(this.widget.id)
	}

	undo() {
		const widgetstore = useWidgetStore()
		widgetstore.addWidget(this.widget)
	}
}

// ================================
//     EXPRESSIONS
// ================================
export class ConvertExpressionToGraph
