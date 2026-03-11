import { useDialogStore } from '@/stores/useDialogStore'
import FeedbackDialog from './FeedbackDialog.vue'
import InfoDialog from './InfoDialog.vue'

// PS dialogs can be used very scalably becaus they are components,
//  so you can open a "confirmDelteDialog" with certain "success"
//  or "failure" hooks or something like that.. pretty cool!
// TODO fix z-index/dialog stacking issues eventually!
export function loadDialogs() {
	const dialogStore = useDialogStore()
	dialogStore.registerDialog('feedback', FeedbackDialog)
	dialogStore.registerDialog('info', InfoDialog)
}
