import { Ball } from '../../../models/Ball.ts'

interface DrawHitLineParams {
  selectedBall: Ball | null
  ctx: CanvasRenderingContext2D | null
  clientCoordinates: { x: number, y: number } | null
  isDrawingHitLine: boolean
}

export const drawHitLine = ({selectedBall, ctx, clientCoordinates, isDrawingHitLine}: DrawHitLineParams) => {
  if (selectedBall && ctx && clientCoordinates && isDrawingHitLine) {
    ctx.beginPath()
    ctx.moveTo(selectedBall.x, selectedBall.y)
    ctx.lineTo(clientCoordinates.x, clientCoordinates.y)
    ctx.strokeStyle = 'orange'
    ctx.lineWidth = 5
    ctx.stroke()
  } else {
    throw new Error('drawHitLine Error')
  }
}