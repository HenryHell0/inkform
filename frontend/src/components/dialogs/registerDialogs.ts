import { useDialogStore } from '@/stores/useDialogStore'
import FeedbackDialog from './FeedbackDialog.vue'

export function loadDialogs() {
	const dialogStore = useDialogStore()
	dialogStore.registerDialog('feedback', FeedbackDialog)
}
