import { Ball } from '../../../models/Ball.ts'
import { MutableRefObject } from 'react'

interface HandleMouseDownParams {
  balls: Ball[] | null
  clientCoordinates: { x: number, y: number } | null
  selectedBallRef: MutableRefObject<Ball | null>
}

export const handleMouseDown = ({ balls, clientCoordinates, selectedBallRef }: HandleMouseDownParams) => {
  if (balls && clientCoordinates) {
    console.log(balls)
    console.log(clientCoordinates)
    balls.forEach(ball => {
      if (Math.hypot(ball.x - clientCoordinates.x, ball.y - clientCoordinates.y) <= ball.radius) {
        selectedBallRef.current = ball
      }
    })
  } else {
    throw new Error('handleMouseDown Error')
  }
}