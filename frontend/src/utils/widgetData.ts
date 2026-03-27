import { useWidgetStore } from '@/stores/useWidgetStore.js'
import { clamp } from '@/utils/utils'
import {
	ChangeGraphColorAction,
	executeAction,
	ExportExpressionFromGraphAction,
	ImportExpressionToGraphAction,
	RemoveExpressionFromGraphAction,
} from './actions'

export type WidgetName = 'Expression' | 'Graph'

export const graphColors = new Map<string, string>([
	['RED', '#c74440'],
	['BLUE', '#2d70b3'],
	['GREEN', '#388c46'],
	['PURPLE', '#6042a6'],
	['ORANGE', '#fa7e19'],
	['BLACK', '#000000'],
])

export abstract class WidgetData {
	private _x = 0 // setting them initially so it's always clamped
	private _y = 0
	private _width = 0
	private _height = 0
	id: string
	zIndex: number

	constructor(x: number, y: number, width: number, height: number) {
		// settting x, y, width, height not _x, _y etc. so that it clamps
		this.width = width
		this.height = height
		this.x = x
		this.y = y
		this.id = crypto.randomUUID()
		this.zIndex = 1
	}

	// Clamp x, y, width, and height to viewport bounds (will change with pannable viewport)
	get x() {
		return this._x
	}
	set x(val: number) {
		const maxX = window.innerWidth - this._width
		this._x = clamp(val, 0, maxX)
	}

	get y() {
		return this._y
	}
	set y(val: number) {
		const maxY = window.innerHeight - this._height
		this._y = clamp(val, 0, maxY)
	}

	get width() {
		return this._width
	}
	set width(val: number) {
		const maxWidth = window.innerWidth - this._x
		this._width = clamp(val, 100, maxWidth) // 100 is minimum width (for now)
	}

	get height() {
		return this._height
	}
	set height(val: number) {
		const maxHeight = window.innerHeight - this._y
		this._height = clamp(val, 100, maxHeight) // 100 is minimum height (for now)
	}
}

export class ExpressionData extends WidgetData {
	type: WidgetName
	latex: string | Promise<string>
	graphColor: string

	constructor(x: number, y: number, width: number, height: number, latex: string | Promise<string>) {
		super(x, y, width, height)
		this.type = 'Expression'
		this.latex = latex

		// determine color :)
		let color = graphColors.values().toArray()[Math.floor(Math.random() * graphColors.size)]
		if (!color) throw new Error('bad math')
		this.graphColor = color
	}
}

export class GraphData extends WidgetData {
	expressions: ExpressionData[]
	type: WidgetName
	calculator!: Desmos.Calculator
	constructor(x: number, y: number, width: number, height: number, expressions: ExpressionData[]) {
		super(x, y, width, height)
		this.type = 'Graph'
		this.expressions = [...expressions]
	}
	// could extract this to addExpression, importExpression, and importHeldExpression
	importHeldExpression() {
		const widget = useWidgetStore().getHeldWidget()
		if (!(widget instanceof ExpressionData)) return

		const addExpressionAction = new AddExpressionToGraphAction(this, widget.id)
		const deleteWidgetAction = new RemoveWidgetAction(widget)
		executeAction(new ActionGroup([addExpressionAction, deleteWidgetAction]))
	}
	deleteExpression(expression: ExpressionData) {
		const widgetStore = useWidgetStore()

		this.expressions = this.expressions.filter((e) => e.id != expression.id)
		this.calculator.removeExpression({ id: expression.id })

		if (this.expressions.length == 0) {
			widgetStore.deleteWidget(this.id)
		}
	}
	changeGraphColor(expressionId: string, color: string) {
		const action = new ChangeGraphColorAction(this, expressionId, color)
		executeAction(action)
	}
	async syncExpression(expressionId: string) {
		// if the expression is in the calculator but not the list, remove it from calculator
		if (
			this.calculator
				.getExpressions()
				.map((expression) => expression.id)
				.includes(expressionId) &&
			!this.expressions.map((expression) => expression.id).includes(expressionId)
		) {
			this.calculator.removeExpression({ id: expressionId })
			return
		}

		// otherwise, add/exit the expression
		const expression = this.expressions.find((expression) => expression.id == expressionId)
		if (!expression) throw new Error("This expression doesen't exist")
		this.calculator.setExpression({
			id: expressionId,
			latex: await expression.latex,
			color: expression.graphColor,
		})
	}
	syncAllExpressions() {
		for (let expression of this.expressions) {
			this.syncExpression(expression.id)
		}
	}
}

export type Widget = ExpressionData | GraphData
