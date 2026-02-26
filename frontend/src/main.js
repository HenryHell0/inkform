import { createApp } from 'vue'
import App from './App.vue'
import VueMathjax from 'vue-mathjax-next'
import { createPinia } from 'pinia'
//import custom directives
import { vTouchPrevent } from './directives/vTouchPrevent'
import { vDrawingOpacity } from './directives/vDrawingOpacity'
import { vToggleClass } from './directives/vToggleClass'


// import styles
import './styles/pallete.css'
import './styles/style.css'

const pinia = createPinia()
const app = createApp(App)
app.use(VueMathjax)
app.use(pinia)

// register custom directives
app.directive('touch-prevent', vTouchPrevent)
app.directive('drawing-opacity', vDrawingOpacity)
app.directive('toggle-class', vToggleClass)



app.mount('#app')
