import { useEffect, useRef, MouseEvent, useState } from 'react'
import styles from './field.module.css'
import { Ball } from '../../models/Ball.ts'
import { Modal } from '../modal/Modal.tsx'

export const Field = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const requestRef = useRef<undefined | number>(undefined)
  const ballsRef = useRef<Ball[] | null>(null)
  const selectedBallRef = useRef<Ball | null>(null)
  const clientCoordinatesRef = useRef<null | { x: number, y: number }>(null)
  const isDrawingHitLine = useRef(false)
  const isPlayerOnField = useRef(false)

  const [isModalActive, setIsModalActive] = useState(false)

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

      if (selectedBallRef.current !== null && isDrawingHitLine.current) {
        drawHitLine()
      }
      requestRef.current = window.requestAnimationFrame(() => drawAll(balls))
    } else {
      throw new Error('Error')
    }
  }

  const drawHitLine = () => {
    if (selectedBallRef.current && canvasRef.current && canvasCtxRef.current && clientCoordinatesRef.current && isDrawingHitLine.current) {
      canvasCtxRef.current.beginPath()
      canvasCtxRef.current.moveTo(selectedBallRef.current.x, selectedBallRef.current.y)
      canvasCtxRef.current.lineTo(clientCoordinatesRef.current.x, clientCoordinatesRef.current.y)
      canvasCtxRef.current.strokeStyle = 'orange'
      canvasCtxRef.current.lineWidth = 5
      canvasCtxRef.current.stroke()
    }
  }

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (ballsRef.current) {
      ballsRef.current.forEach(ball => {
        if (Math.hypot(ball.x - e.clientX, ball.y - e.clientY) <= ball.radius) {
          selectedBallRef.current = ball
        }
      })
    }
  }

  const handleMouseUp = () => {
    if (selectedBallRef.current) {
      if (Math.hypot(selectedBallRef.current.x - clientCoordinatesRef.current.x, selectedBallRef.current.y - clientCoordinatesRef.current.y) <= selectedBallRef.current.radius) {
        setIsModalActive(true)
        isPlayerOnField.current = false
        console.log(isPlayerOnField.current)
      } else {
        selectedBallRef.current.vx = -(clientCoordinatesRef.current.x - selectedBallRef.current.x) / 50
        selectedBallRef.current.vy = -(clientCoordinatesRef.current.y - selectedBallRef.current.y) / 50
        selectedBallRef.current = null
        isDrawingHitLine.current = false
      }
    }
  }

  const handleMouseMove = (e: any) => {
    clientCoordinatesRef.current = {
      x: e.clientX,
      y: e.clientY,
    }
    if (isPlayerOnField.current) {
      if (!isDrawingHitLine.current) {
        if (selectedBallRef.current && Math.hypot(selectedBallRef.current.x - e.clientX, selectedBallRef.current.y - e.clientY) > selectedBallRef.current.radius) {
          isDrawingHitLine.current = true
        }
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalActive(false)
    selectedBallRef.current = null
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
        isPlayerOnField.current = true
        requestRef.current = window.requestAnimationFrame(() =>
          drawAll(ballsRef.current as Ball[]),
        )
      })

      canvasRef.current.addEventListener('mouseout', () => {
        isPlayerOnField.current = false
        cancelAnimationFrame(requestRef.current as number)
      })

      canvasRef.current.addEventListener('mousemove', (e) => handleMouseMove(e))
    }

    return () => {
      isPlayerOnField.current = false
      cancelAnimationFrame(requestRef.current as number)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className={styles.field} onMouseUp={() => {
        handleMouseUp()
      }} onMouseDown={(e) => handleMouseDown(e)}>

      </canvas>
      {isModalActive && <Modal ball={selectedBallRef.current} closeModal={handleCloseModal} />}
    </>
  )
}