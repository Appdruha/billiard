import { MutableRefObject } from 'react'
import { Ball } from '../../../models/Ball.ts'
import {MouseEvent} from 'react'


interface HandleMouseMoveParams {
  clientCoordinatesRef: MutableRefObject<{x: number, y: number} | null>
  isDrawingHitLine: MutableRefObject<boolean | null>
  isPlayerOnField: MutableRefObject<boolean | null>
  selectedBall: Ball | null
  event: MouseEvent<HTMLCanvasElement>
  canvas: HTMLCanvasElement | null
}

export const handleMouseMove = ({clientCoordinatesRef, selectedBall, isDrawingHitLine, isPlayerOnField, event, canvas}: HandleMouseMoveParams) => {
  if (!canvas) {
    throw new Error('handleMouseMove Error')
  }
  const {x: canvasX, y: canvasY} = canvas.getBoundingClientRect()
  clientCoordinatesRef.current = {
    x: event.clientX - canvasX,
    y: event.clientY - canvasY,
  }
  if (isPlayerOnField.current) {
    if (!isDrawingHitLine.current) {
      if (selectedBall && Math.hypot(selectedBall.x - event.clientX, selectedBall.y - event.clientY) > selectedBall.radius) {
        isDrawingHitLine.current = true
      }
    }
  }
}