import { useRouter, type RouteLocationNamedRaw } from 'vue-router'

// this will be useWhiteboardViewDialogs cause it's just for whiteboard .. since it goes to "home" which is the whiteboard page (for now, will be whiteboard:home in the future)
export function useRouteDialogs() {
	const router = useRouter()

	function open(name: RouteLocationNamedRaw['name']) {
		router.push({ name })
	}

	function close() {
		router.replace({ name: 'home' })
	}

	return { open, close }
}
