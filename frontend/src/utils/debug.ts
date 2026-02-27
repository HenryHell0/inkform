import { ExpressionData, GraphData } from './widgetData.js'
import { useWidgetStore } from '@/stores/useWidgetStore.js'
const isDev = import.meta.env.DEV

const considerDebug = (value: boolean) => isDev && value

export const DEBUG = {
	createTestExpression: considerDebug(false),
	createTestGraph: considerDebug(false),
	doLogMouseMovements: considerDebug(false),
	downloadPNG: considerDebug(false),
	logLatex: considerDebug(false),
	addTestWidgets,
	logMouseMovements: logMouseMovement,
}

export function addTestWidgets() {
	const widgetStore = useWidgetStore()

	if (DEBUG.createTestExpression) {
		widgetStore.addWidget(new ExpressionData(100, 100, 515, 150, 'x^2+2x-1'))
	}

	if (DEBUG.createTestGraph) {
		widgetStore.widgets.push(
			new GraphData(410, 300, 714, 615, [
				new ExpressionData(410, 300, 410, 300, 'x^2+2x-1'),
				new ExpressionData(410, 300, 410, 300, '\\sin(x)'),
			]),
		)
	}
}

export function logMouseMovement(event: PointerEvent) {
	if (!DEBUG.doLogMouseMovements) return
	console.log(
		`ClientX: ${event.clientX}  ClientY: ${event.clientY}. \n OffsetX: ${event.offsetX}  OffsetY: ${event.offsetY}`,
	)
}
