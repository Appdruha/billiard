import { useEffect, useRef } from 'react'
import styles from './field.module.css'
import { Ball } from '../../models/Ball.ts'

export const Field = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const requestRef = useRef<undefined | number>()
  const ballsRef = useRef<Ball[] | null>()

  const generateBalls = (ballsQuantity: number, ctx: CanvasRenderingContext2D, fieldWidth: number, fieldHeight: number) => {
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
      ballsArr.push(new Ball({ x, y, dy: 4, dx: 4, radius, color: 'red', ctx, id: i }))
    }
    // ballsArr.forEach(ball => ball.draw(fieldHeight, fieldWidth))
    return ballsArr
  }

  function drawAll(balls: Ball[]) {
    if (canvasRef.current !== null && canvasCtxRef.current) {
      canvasCtxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      canvasCtxRef.current.fillStyle = 'green'
      canvasCtxRef.current.fillRect(0, 0, 400, 600)
      balls.forEach(ball => {
        ball.draw(canvasRef.current.height, canvasRef.current.width, balls.filter(otherBall => otherBall.id !== ball.id))
        ball.x += ball.dx
        ball.y += ball.dy
      })
      requestRef.current = window.requestAnimationFrame(() => drawAll(balls))
    } else {
      throw new Error('Error')
    }
  }

  useEffect(() => {
    if (canvasRef.current !== null) {
      canvasCtxRef.current = canvasRef.current.getContext('2d')
      canvasRef.current.width = 400
      canvasRef.current.height = 600
    } else {
      throw new Error('No canvas is found.')
    }

    if (canvasCtxRef.current !== null) {
      ballsRef.current = generateBalls(2, canvasCtxRef.current, canvasRef.current.width, canvasRef.current.height)
    } else {
      throw new Error('No canvas context is found.')
    }

    if (ballsRef.current) {
      canvasRef.current.addEventListener('mouseover', () => {
        console.log('over')
        requestRef.current = window.requestAnimationFrame(() =>
          drawAll(ballsRef.current as Ball[]),
        )
      })

      canvasRef.current.addEventListener('mouseout', () => {
        console.log('out')
        cancelAnimationFrame(requestRef.current as number)
      })
    }

    return () => cancelAnimationFrame(requestRef.current as number)
  }, [])

  return (
    <canvas ref={canvasRef} className={styles.field}>

    </canvas>
  )
}

// otherBalls.forEach(ball => {
//   if (Math.floor(Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2))) <= ball.radius + this.radius) {
//     const angle = Math.atan((this.x - ball.x) / (this.y - ball.y)) + Math.PI
//     const speed = this.speed / 2
//     const ballDy = speed * Math.cos(angle)
//     const ballDx = Math.sqrt(speed * speed - ballDy * ballDy)
//     ball.dx = ballDx
//     ball.dy = ballDy
//     ball.y += 3*ballDy
//     ball.x += 3*ballDx
//     const dy = speed * Math.cos(angle - Math.PI / 2)
//     const dx = Math.sqrt(speed * speed - dy * dy)
//     this.dx = dx
//     this.dy = dy
//     this.x += 3*dx
//     this.y += 3*dy
//   }
// })