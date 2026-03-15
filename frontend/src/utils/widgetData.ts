import { useWidgetStore } from '@/stores/useWidgetStore.js'

export type WidgetName = 'Expression' | 'Graph'

export const graphColors = new Map<string, string>([
	['RED', '#c74440'],
	['BLUE', '#2d70b3'],
	['GREEN', '#388c46'],
	['PURPLE', '#6042a6'],
	['ORANGE', '#fa7e19'],
	['BLACK', '#000000'],
])


abstract class WidgetData {
	x: number
	y: number
	width: number
	height: number
	id: string
	zIndex: number

	constructor(x: number, y: number, width: number, height: number) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.id = crypto.randomUUID()
		this.zIndex = 1
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
	convertToGraph (){
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
}

export type Widget = ExpressionData | GraphData
