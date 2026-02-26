import { useCanvasStore } from '@/stores/useCanvasStore'

export interface Position {
	x: number
	y: number
}

export interface Path {
	d: string
	id: string
}
