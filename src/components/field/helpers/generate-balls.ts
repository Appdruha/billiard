import { Ball } from '../../../models/Ball.ts'

export const generateBalls = (ballsQuantity: number, ctx: CanvasRenderingContext2D, fieldWidth: number, fieldHeight: number) => {
  const ballsArr: Ball[] = []
  for (let i = 0; i < ballsQuantity; i++) {
    const radius = Math.floor(Math.random() * 20) + 20
    const x = Math.floor(Math.random() * (fieldWidth - 2 * radius)) + radius
    const y = Math.floor(Math.random() * (fieldHeight - 2 * radius)) + radius
    if (ballsArr) {
      let isAcceptablePosition = true
      ballsArr.forEach(ball => {
        if (Math.sqrt(Math.pow(ball.x - x, 2) + Math.pow(ball.y - y, 2)) < ball.radius + radius) {
          return isAcceptablePosition = false
        }
      })
      if (!isAcceptablePosition) {
        i--
        continue
      }
    }
    ballsArr.push(new Ball({ x, y, radius, color: 'red', ctx, id: i }))
  }
  return ballsArr
}