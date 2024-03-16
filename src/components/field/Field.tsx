import { useEffect, useRef, MouseEvent } from 'react'
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
      ballsArr.push(new Ball({ x, y, radius, color: 'red', ctx, id: i }))
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
        ball.x += ball.vx
        ball.y += ball.vy
      })
      requestRef.current = window.requestAnimationFrame(() => drawAll(balls))
    } else {
      throw new Error('Error')
    }
  }

  const moveBallOnClick = (e: MouseEvent<HTMLCanvasElement>) => {
    if (ballsRef.current) {
      ballsRef.current.forEach(ball => {
        if (Math.sqrt(Math.pow(ball.x - e.clientX, 2) + Math.pow(ball.y - e.clientY, 2)) <= ball.radius) {
          ball.vx = 2
          ball.vy = 2
        }
      })
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
      ballsRef.current = generateBalls(8, canvasCtxRef.current, canvasRef.current.width, canvasRef.current.height)
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
    <canvas ref={canvasRef} className={styles.field} onClick={(e) => moveBallOnClick(e)}>

    </canvas>
  )
}