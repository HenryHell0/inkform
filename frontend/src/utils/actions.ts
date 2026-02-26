import { useCanvasStore } from '@/stores/useCanvasStore'
import type { Path } from '@/types/types'

export interface Action {
	do(): void
	undo(): void
}

export class AddPathAction implements Action {
	constructor(private path: Path) {}

	do() {
		const canvasStore = useCanvasStore()
		canvasStore.paths.push(this.path)
	}

	undo() {
		const canvasStore = useCanvasStore()
		canvasStore.paths = canvasStore.paths.filter((p) => p.id !== this.path.id)
	}
}
export class RemovePathAction implements Action {
	constructor(private path: Path) {}

	do() {
		const canvasStore = useCanvasStore()
		canvasStore.paths = canvasStore.paths.filter((p) => p.id !== this.path.id)
	}

	undo() {
		const canvasStore = useCanvasStore()
		canvasStore.paths.push(this.path)
	}
}
