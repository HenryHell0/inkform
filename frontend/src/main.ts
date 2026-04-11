import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import VueMathjax from 'vue-mathjax-next'
import { routes } from './routes'
import { createPinia } from 'pinia'
//import custom directives
import { vTouchPrevent } from './directives/vTouchPrevent'
import { vDrawingOpacity } from './directives/vDrawingOpacity'

// import styles
import './styles/pallete.css'
import './styles/style.css'

export const createApp = ViteSSG(App, { routes }, ({ app, router, routes, initialState }) => {
	// CONFIGURE PINIA
	const pinia = createPinia()
	app.use(pinia)
	if (import.meta.env.SSR) initialState.pinia = pinia.state.value
	else pinia.state.value = initialState.pinia || {}

	// OTHER PLUGINS
	app.use(VueMathjax)
	app.use(router) // this is required 😎

	// LOAD DIRECTIVES
	app.directive('touch-prevent', vTouchPrevent)
	app.directive('drawing-opacity', vDrawingOpacity)
})
