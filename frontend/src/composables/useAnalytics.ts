export function useAnalytics() {
	function logConvertExpression() {
		window.gtag?.('event', 'convert_expression')
		// TODO add other data here, like success/not, type of expression, time. etc.
	}

	return { logConvertExpression }
}
