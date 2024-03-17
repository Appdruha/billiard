import { createPortal } from 'react-dom'
import styles from './modal.module.css'
import { useEffect, useRef, useState } from 'react'
import { Ball } from '../../models/Ball.ts'

const portal = document.getElementById('portal')!

export const Modal = (props: {closeModal: () => void, ball: Ball | null}) => {
  const modalRef = useRef<HTMLCanvasElement | null>(null)
  const [color, setColor] = useState('#FFF')

  function pickColor(event, ctx: CanvasRenderingContext2D) {
    const x = event.layerX;
    const y = event.layerY;
    const pixel = ctx.getImageData(x, y, 1, 1);
    const data = pixel.data;
    const rgba =
      "rgba(" +
      data[0] +
      ", " +
      data[1] +
      ", " +
      data[2] +
      ", " +
      data[3] / 255 +
      ")";
    setColor(rgba)
  }

  function drawPalette(ctx: CanvasRenderingContext2D) {
    let gradient = ctx.createLinearGradient(0, 0, 300, 0);
    // Create color gradient
    gradient.addColorStop(0,    "rgb(255,   0,   0)");
    gradient.addColorStop(0.15, "rgb(255,   0, 255)");
    gradient.addColorStop(0.33, "rgb(0,     0, 255)");
    gradient.addColorStop(0.49, "rgb(0,   255, 255)");
    gradient.addColorStop(0.67, "rgb(0,   255,   0)");
    gradient.addColorStop(0.84, "rgb(255, 255,   0)");
    gradient.addColorStop(1,    "rgb(255,   0,   0)");
    // Apply gradient to canvas
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 300, 300);

    // Create semi transparent gradient (white -> trans. -> black)
    gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
    gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");
    // Apply gradient to canvas
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 300, 300);
  }

  const handleClick = () => {
    props.ball.color = color
    props.closeModal()
  }

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.width = 300
      modalRef.current.height = 300
      const ctx = modalRef.current.getContext('2d')
      if (ctx != null) {
        drawPalette(ctx)
        modalRef.current.addEventListener("click", (e) => pickColor(e, ctx));
      }
    }
  }, [])

  return (
    createPortal(
      <div className={styles.modalContainer}>
        <div className={styles.modal}>
          <canvas ref={modalRef} className={styles.palette}></canvas>
          <button style={{background: color}} className={styles.btn} onClick={handleClick}>Принять</button>
        </div>
      </div>,
      portal,
    )
  )
}