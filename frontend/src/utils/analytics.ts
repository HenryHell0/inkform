export function logConvertExpression() {
	window.gtag?.('event', 'convert_expression')
	// TODO add other data here, like success/not, type of expression, LaTeX?, time. etc.
}

export function logGraphExpression() {
	// TODO we could also include other data here aswell, like type of expression, LaTeX, etc..
	/*
		! also, should this happen only once per expression or every time you click graph on something..
		! you could graph -> ungraph -> graph -> ungraph and it would log a bunch..
		! although it doesen't log twice for undo/redo which is good!
		*/
	window.gtag?.('event', 'graph_expression')
}
