import { useWidgetStore } from '@/stores/useWidgetStore.js'
import { clamp, copyTextWithPopup } from '@/utils/utils'

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
	async copyLatex() {
		copyTextWithPopup(await this.latex) // ! icky! all this await stuff should be cleaned up with the new system
	}
	convertToGraph() {
		// this should use history actions in the future btw!
		const widgetStore = useWidgetStore()
		widgetStore.addWidget(new GraphData(this.x, this.y, this.width, this.width, [this])) // self.width twice is intentional
		widgetStore.deleteWidget(this.id)
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
	async addExpression(expression: ExpressionData) {
		this.expressions.push(expression)
		const graph = { latex: expression.latex, color: expression.graphColor, id: expression.id }
		this.calculator.setExpression({ latex: await graph.latex, color: graph.color, id: graph.id })
	}
	deleteExpression(expression: ExpressionData) {
		const widgetStore = useWidgetStore()

		this.expressions = this.expressions.filter((e) => e.id != expression.id)
		this.calculator.removeExpression({ id: expression.id })

		if (this.expressions.length == 0) {
			widgetStore.deleteWidget(this.id)
		}
	}
	changeGraphColor(expression: ExpressionData, color: string) {
		expression.graphColor = color
		this.calculator.setExpression({ id: expression.id, color: color })
	}
	copyExpression(expression: ExpressionData) {
		expression.copyLatex()
	}
}

export type Widget = ExpressionData | GraphData
