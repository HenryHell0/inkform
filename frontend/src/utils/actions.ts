import { useCanvasStore } from '@/stores/useCanvasStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { useWidgetStore } from '@/stores/useWidgetStore'
import type { Path, Position, Size } from '@/types/types'
import { GraphData, type ExpressionData, type Widget } from './widgetData'

export function executeAction(action: Action | null) {
	if (!action) return // do we need this?
	useHistoryStore().execute(action)
}

export function pushAction(action: Action) {
	useHistoryStore().push(action)
}

// one issue with these is that they aren't serializeable - so we might want to extract behavior in the future :)
export interface Action {
	do(): void
	undo(): void
}

// =========================
//      ACTION GROUP
// =========================
/* FYI on how cool this is:
keep in mind it's SUPER cool how these actions are scalable. for example I can stack remove path actions to create the removal of multiple, and then I can group that with a create expression action to represent recognizing text, having it removed, and adding an expression widget.
It's also cool that the classes like stack on each other. I was originally trying to do it more procedurally but this funcational/OOP method is better (function in that groupaction.do => each action.do => ..., OOP because I'm stacking the classes). Originally the ignorant procedural approach was to do like historyStore.done: Action | ActionGroup. One problem with this is I have to change the action execution system completely. Another is that I can't have a tree of groups, whereas with like stacking the classes I can. With the class-based approach I create a class that implements the class and basically "runs" two other classes, and then each of those classes can also be group actions. Pretty cool!!
It's very vue-idiomatic in my opinion, because it's a lot like composable stacking! sorta. except here its kinda like bottom up (or maybe this way is top down not bottom up?) Anyways I think whereas my current approach to composable is to directly use the composable in another one, I think it would be cool if I implemented a composable where you can pass the results of a composable in and stack like that. idk something to think about!
*/
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

	get length() {
		return this.actions.length
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

// one BIG issue with this system is that LaTeX isn't cached, so it re-recognizes each time. we need to fix that! and centralize storage of widgets. right now they are all over the place
// NOTE could this be used in reverse to convert an expression back to writing (do => undo, undo => do)
export class RecognizeCanvasAction extends ActionGroup {
	constructor(widget: ExpressionData, paths: Path[]) {
		const createWidgetAction = new AddWidgetAction(widget)
		const addPathsAction = new ActionGroup(paths.map((path) => new RemovePathAction(path)))
		super([createWidgetAction, addPathsAction])
	}
}
// ================================
//     WIDGETS
// ================================
export class MoveWidgetAction implements Action {
	constructor(
		private id: string,
		private to: Position,
		private from: Position, // TODO we could make this optional if wanted
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
// this also shouldn't require a "from" parameter
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

export class AddWidgetAction extends ActionGroup {
	constructor(widget: Widget) {
		const addWidgetAction = new (class implements Action {
			constructor(private widget: Widget) {} // NOTE this is storing widgets twice in memory now, but we should really just have a list of them and then like enable/disable them or something
			do() {
				const widgetStore = useWidgetStore()
				widgetStore.widgets.push(this.widget)
			}

			undo() {
				const widgetStore = useWidgetStore()
				widgetStore.widgets = widgetStore.widgets.filter((e) => e.id != this.widget.id)
			}
		})(widget)
		const bringWidgetToFrontAction = new BringWidgetToFrontAction(widget)

		super([addWidgetAction, bringWidgetToFrontAction])
	}
}

export class RemoveWidgetAction implements Action {
	constructor(private widget: Widget) {}
	do() {
		const widgetStore = useWidgetStore()
		widgetStore.widgets = widgetStore.widgets.filter((e) => e.id != this.widget.id)
	}

	undo() {
		const widgetStore = useWidgetStore()
		widgetStore.widgets.push(this.widget)
	}
}

export class EditWidgetAction<T extends Widget> implements Action {
	private before: Partial<T> = {}

	constructor(
		private id: string,
		private edits: Partial<T>,
		private afterUpdate?: (widget: T) => void,
	) {
		const widget = useWidgetStore().getWidgetById(this.id) as T

		for (const key in edits) {
			const k = key as keyof T
			this.before[k] = widget[k] // could cause errors if widget[k] changes
		}
	}
	do() {
		const widgetStore = useWidgetStore()
		const widget = widgetStore.getWidgetById(this.id) as T
		Object.assign(widget, this.edits) // object.assign preserves reactivity
		this.afterUpdate?.(widget)
	}

	undo() {
		const widgetStore = useWidgetStore()
		const widget = widgetStore.getWidgetById(this.id) as T
		Object.assign(widget, this.before) // object.assign preserves reactivity
		this.afterUpdate?.(widget)
	}
}
// ================================
//     Z-INDEX STUFF 😥
// ================================
export function isWidgetCovered(widget: Widget, zIndex?: number) {
	const widgetStore = useWidgetStore()
	const testZIndex = zIndex ?? widget.zIndex

	if (testZIndex == widgetStore.zIndexCount) return false
	if (!widgetStore.getCollidingWidgets(widget.id).some((other) => other.zIndex > testZIndex)) return false

	return true
}

export class BringWidgetToFrontAction implements Action {
	private previousZIndex: number

	constructor(private widget: Widget) {
		this.previousZIndex = widget.zIndex
	}

	do() {
		const widgetStore = useWidgetStore()
		widgetStore.zIndexCount++
		this.widget.zIndex = widgetStore.zIndexCount
	}

	undo() {
		this.widget.zIndex = this.previousZIndex
	}
}

export class ChangeZIndexAction implements Action {
	constructor(
		private widget: Widget,
		private newZIndex: number,
		private previousZIndez: number,
	) {}

	do() {
		this.widget.zIndex = this.newZIndex
	}

	undo() {
		this.widget.zIndex = this.previousZIndez
	}
}

// ================================
//     EXPRESSIONS
// ================================
export class ConvertExpressionToGraphAction extends ActionGroup {
	constructor(expressionWidget: ExpressionData) {
		const addGraphwidget = new AddWidgetAction(
			new GraphData(
				expressionWidget.x,
				expressionWidget.y,
				expressionWidget.width,
				expressionWidget.width, // NOTE: expressionWidget.width twice is intentional
				[expressionWidget],
			),
		)

		const deleteExpressionWidget = new RemoveWidgetAction(expressionWidget)

		super([addGraphwidget, deleteExpressionWidget])
	}
}

// ================================
//     GRAPHS
// ================================
// we could also just move this logic to GraphData instead of it's own action class
export class ChangeGraphColorAction extends EditWidgetAction<GraphData> {
	constructor(graph: GraphData, expressionId: string, newColor: string) {
		const newExpressions = graph.expressions.map((expression) => {
			if (expression.id != expressionId) return expression
			return {
				...expression,
				graphColor: newColor,
			}
		}) as ExpressionData[]

		super(graph.id, { expressions: newExpressions }, (graph) => {
			graph.syncExpression(expressionId)
		})
	}
}

// this does NOT delete the expression, just adds it.
export class AddExpressionToGraphAction extends EditWidgetAction<GraphData> {
	constructor(graph: GraphData, expressionId: string) {
		// mutate graphData with new expression..
		const expression = useWidgetStore().getWidgetById(expressionId) as ExpressionData
		const newExpressions = [expression, ...graph.expressions]

		super(graph.id, { expressions: newExpressions }, (graph) => {
			graph.syncExpression(expressionId)
		})
	}
}

export class ImportExpressionToGraphAction extends ActionGroup {
	constructor(graph: GraphData, expressionId: string) {
		const addExpressionAction = new AddExpressionToGraphAction(graph, expressionId)
		const expression = useWidgetStore().getWidgetById(expressionId)
		const deleteWidgetAction = new RemoveWidgetAction(expression)

		super([addExpressionAction, deleteWidgetAction])
	}
}

export class RemoveExpressionFromGraphAction extends ActionGroup {
	constructor(graph: GraphData, expressionId: string) {
		const actions: Action[] = []

		// get the new expressions list
		const newExpressions = graph.expressions.filter((expression) => expression.id != expressionId)

		// update the graph's expressions
		actions.push(
			new EditWidgetAction<GraphData>(graph.id, { expressions: newExpressions }, (graph) => {
				graph.syncExpression(expressionId)
			}),
		)

		// if the graph is out of expressions, delete it
		if (newExpressions.length <= 0) {
			actions.push(new RemoveWidgetAction(graph))
		}

		super(actions)
	}
}

export class ExportExpressionFromGraphAction extends ActionGroup {
	constructor(graph: GraphData, expressionId: string, newExpressionPosition: Position) {
		const expression = graph.expressions.find((expression) => expression.id == expressionId)
		if (!expression) throw new Error('expression not found when removing from graph')
		const removeExpressionFromGraphAction = new RemoveExpressionFromGraphAction(graph, expressionId)

		const addExpressionAction = new AddWidgetAction(expression)
		const moveExpressionAction = new MoveWidgetAction(expression.id, newExpressionPosition, {
			x: expression.x,
			y: expression.y,
		})
		const updateZIndexAction = new BringWidgetToFrontAction(expression)

		super([removeExpressionFromGraphAction, addExpressionAction, moveExpressionAction, updateZIndexAction])
	}
}
