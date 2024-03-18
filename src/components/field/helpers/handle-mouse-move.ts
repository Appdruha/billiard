import { MutableRefObject } from 'react'
import { Ball } from '../../../models/Ball.ts'
import {MouseEvent} from 'react'


interface HandleMouseMoveParams {
  clientCoordinatesRef: MutableRefObject<{x: number, y: number} | null>
  isDrawingHitLine: MutableRefObject<boolean | null>
  isPlayerOnField: MutableRefObject<boolean | null>
  selectedBall: Ball | null
  event: MouseEvent<HTMLCanvasElement>
}

export const handleMouseMove = ({clientCoordinatesRef, selectedBall, isDrawingHitLine, isPlayerOnField, event}: HandleMouseMoveParams) => {
  clientCoordinatesRef.current = {
    x: event.clientX,
    y: event.clientY,
  }
  if (isPlayerOnField.current) {
    if (!isDrawingHitLine.current) {
      if (selectedBall && Math.hypot(selectedBall.x - event.clientX, selectedBall.y - event.clientY) > selectedBall.radius) {
        isDrawingHitLine.current = true
      }
    }
  }
}