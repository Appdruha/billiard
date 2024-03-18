import { useEffect, useRef, useState } from 'react'
import styles from './field.module.css'
import { Ball } from '../../models/Ball.ts'
import { Modal } from '../modal/Modal.tsx'
import { generateBalls } from './helpers/generate-balls.ts'
import { fieldSize } from '../../consts/canvas-sizes.ts'
import { drawHitLine } from './helpers/draw-hit-line.ts'
import { handleMouseDown } from './helpers/handle-mouse-down.ts'
import { handleMouseUp } from './helpers/handle-mouse-up.ts'
import { handleMouseMove } from './helpers/handle-mouse-move.ts'

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

  function drawAll(balls: Ball[]) {
    if (canvasCtxRef.current) {
      canvasCtxRef.current.clearRect(0, 0, fieldSize.width, fieldSize.height)
      canvasCtxRef.current.fillStyle = 'green'
      canvasCtxRef.current.fillRect(0, 0, 400, 600)
      balls.forEach(ball => {
        ball.draw(fieldSize.height, fieldSize.width, balls.filter(otherBall => otherBall.id !== ball.id))
        ball.x += ball.vx
        ball.y += ball.vy
      })

      if (selectedBallRef.current !== null && isDrawingHitLine.current) {
        drawHitLine({
          ctx: canvasCtxRef.current,
          isDrawingHitLine: isDrawingHitLine.current,
          clientCoordinates: clientCoordinatesRef.current,
          selectedBall: selectedBallRef.current,
        })
      }
      requestRef.current = window.requestAnimationFrame(() => drawAll(balls))
    } else {
      throw new Error('drawAll Error')
    }
  }

  const handleMouseOver = () => {
    isPlayerOnField.current = true
    requestRef.current = window.requestAnimationFrame(() =>
      drawAll(ballsRef.current as Ball[]),
    )
  }

  const handleMouseOut = () => {
    isPlayerOnField.current = false
    cancelAnimationFrame(requestRef.current as number)
  }

  const handleCloseModal = () => {
    setIsModalActive(false)
    selectedBallRef.current = null
  }

  useEffect(() => {
    if (canvasRef.current !== null) {
      canvasCtxRef.current = canvasRef.current.getContext('2d')
      canvasRef.current.width = fieldSize.width
      canvasRef.current.height = fieldSize.height
    } else {
      throw new Error('No canvas is found')
    }

    if (canvasCtxRef.current !== null) {
      ballsRef.current = generateBalls(8, canvasCtxRef.current, canvasRef.current.width, canvasRef.current.height)
    } else {
      throw new Error('No canvas context is found')
    }

    return () => {
      isPlayerOnField.current = false
      cancelAnimationFrame(requestRef.current as number)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className={styles.field}
              onMouseOver={() => handleMouseOver()}
              onMouseOut={() => handleMouseOut()}
              onMouseMove={(event) => {
                handleMouseMove({
                  selectedBall: selectedBallRef.current,
                  isPlayerOnField,
                  clientCoordinatesRef,
                  isDrawingHitLine,
                  event,
                })
              }}
              onMouseUp={() => {
                handleMouseUp({
                  selectedBallRef,
                  isDrawingHitLine,
                  isPlayerOnField,
                  clientCoordinates: clientCoordinatesRef.current,
                  setIsModalActive,
                })
              }}
              onMouseDown={() => {
                handleMouseDown({
                  balls: ballsRef.current,
                  clientCoordinates: clientCoordinatesRef.current,
                  selectedBallRef,
                })
              }}
      ></canvas>
      {isModalActive && <Modal ball={selectedBallRef.current} closeModal={handleCloseModal} />}
    </>
  )
}