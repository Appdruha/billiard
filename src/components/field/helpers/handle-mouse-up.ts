import { Ball } from '../../../models/Ball.ts'
import { MutableRefObject } from 'react'

interface HandleMouseUpParams {
  selectedBallRef: MutableRefObject<Ball | null>
  clientCoordinates: { x: number, y: number } | null
  setIsModalActive: (param: boolean) => void
  isPlayerOnField: MutableRefObject<boolean>
  isDrawingHitLine: MutableRefObject<boolean>
}

export const handleMouseUp = ({ selectedBallRef, clientCoordinates, setIsModalActive, isPlayerOnField, isDrawingHitLine }: HandleMouseUpParams) => {
  if (selectedBallRef.current && clientCoordinates) {
    if (Math.hypot(selectedBallRef.current.x - clientCoordinates.x, selectedBallRef.current.y - clientCoordinates.y) <= selectedBallRef.current.radius) {
      setIsModalActive(true)
      isPlayerOnField.current = false
    } else {
      selectedBallRef.current.vx = -(clientCoordinates.x - selectedBallRef.current.x) / 50
      selectedBallRef.current.vy = -(clientCoordinates.y - selectedBallRef.current.y) / 50
      selectedBallRef.current = null
      isDrawingHitLine.current = false
    }
  } else {
    throw new Error('handleMouseUp Error')
  }
}